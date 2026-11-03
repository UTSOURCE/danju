# *.utsource.net 证书链兼容性问题及修复指引

> 日期：2026-11-03　|　影响域名：`supp-api.utsource.net`、`upup.utsource.net`（同一张通配符证书）
> 问题性质：**部分 Android 设备无法验证服务器证书，所有 HTTPS 接口请求失败**（App 登录/上传/列表全部不可用）

---

## 一、现象

| 环境 | 结果 |
|---|---|
| 桌面浏览器 / macOS / Windows | 正常（操作系统证书库较新，或浏览器自带根证书库） |
| 新版 Android（WebView 已随 Chrome 更新） | 基本正常 |
| **Android 8~12 系统证书库未更新的设备（实测 API 31 模拟器，WebView 91）** | **全部 HTTPS 请求握手失败** |

客户端报错：`ERR_CERT_AUTHORITY_INVALID`（`net_error -202`），Nginx 侧无异常，属于客户端证书验证环节失败。

## 二、原因

当前服务器下发的证书链：

```
[0] 叶子证书  CN=*.utsource.net  (O=创新无限信息技术（武汉）有限公司)
      ↑ 签发者
[1] 中间证书  CN=WoTrus RSA OV SSL CA 2  (沃通 CA)
      ↑ 签发者
[2] 根证书    CN=Sectigo Public Server Authentication Root R46   ← 服务器未下发（根证书本就不需要下发）
```

问题点：

1. **Sectigo R46 是较新的根证书**（2021 年起才逐步进入各系统信任库）。Android 的系统 CA 库随系统镜像走，很多 Android 8~12 设备的信任库里**既没有 Sectigo R46，也没有沃通（WoTrus）的根**。实测 Android 12 模拟器系统内的 129 个系统 CA 中两者均不存在。
2. 服务器**只下发了 "叶子 + 沃通中间" 两级证书，没有提供交叉签名（cross-signed）版本的中间证书**。老设备找不到 "沃通中间证书 → 某个受信任老根" 的路径，验证即失败。

## 三、修复方案（按优先级）

### 方案 A（推荐，一劳永逸）：更换为主流老牌 CA 的证书

从 **DigiCert / GlobalSign / Sectigo（老根链，如 USERTrust RSA / AAA Certificate Services）** 等购买/更换。
选型要求：**签发链必须能锚定到 2015 年以前就广泛存在于各系统的老根证书**。
这些 CA 的根几乎存在于所有 Android/iOS/Windows 系统库中，无需依赖设备更新。

### 方案 B（不更换 CA，立刻可做）：补发交叉签名中间证书

联系沃通（WoTrus）索取**交叉签名版本**的中间证书（老根签名，常见为 `USERTrust RSA Certification Authority`、`AAA Certificate Services` 或 `GlobalSign Root CA` 交叉），然后在 Nginx 的 `ssl_certificate`（fullchain 文件）中按顺序同时下发：

```
1. CN=*.utsource.net                          （叶子）
2. CN=WoTrus RSA OV SSL CA 2 （交叉签名版，由老根签发）   ← 新增
3. CN=WoTrus RSA OV SSL CA 2 （R46 链版本）             ← 现有这条保留
```

Nginx 配置示例（注意 fullchain 顺序必须是叶子在最前）：

```nginx
server {
    listen 443 ssl;
    server_name supp-api.utsource.net;
    ssl_certificate     /etc/nginx/ssl/utsource-fullchain-compat.pem;
    ssl_certificate_key /etc/nginx/ssl/utsource.key;
    ...
}
```

`utsource-fullchain-compat.pem` = 叶子 + 交叉中间 + R46 中间，三个 PEM 依次拼接。

> 说明：同一张叶子证书，两条链（老根交叉链 + R46 链）一起下发是标准做法。
> 新设备走 R46 链，老设备走交叉链，全部兼容。

### 方案 C（当前客户端策略）

App 客户端（Android `MainActivity.java`）已配置为**所有构建（含正式包）放行证书错误**——这是业务决策：服务端证书再出问题时 App 不中断可用。
放行时 logcat 会输出 `TAG=DanjuSSL` 的警告日志，可用于确认真实证书故障。
**服务端仍应按方案 A/B 完成修复**，消除对客户端放行的依赖（iOS 端与浏览器端不受此保护）。

## 四、修复后如何验证

1. 命令行检查链是否完整（应能看到老根交叉签发的中间证书）：

```bash
openssl s_client -connect supp-api.utsource.net:443 -servername supp-api.utsource.net -showcerts 2>/dev/null | grep -E "^\s*[0-9] s:|^\s*i:"
```

期望输出中出现 `i:` 为老根（如 `USERTrust RSA` / `AAA Certificate Services` / `GlobalSign`）的交叉中间证书。

2. 在线检测：<https://www.ssllabs.com/ssltest/>，提交域名后确认：
   - **Chain issues: none**
   - **Certification Paths** 一节显示包含老设备兼容路径（Downgrade/Snap End 无异常）

3. 实机验证：Android 8~12 未更新系统的设备（或 API 31 模拟器）直接访问 `https://supp-api.utsource.net`，不再报证书错误即可。

## 五、影响范围清单

受影响的域名（同一张 `*.utsource.net` 通配符证书，修复一次全部生效）：

- `supp-api.utsource.net` — App 业务接口
- `upup.utsource.net` — 单据图片上传/图片展示
- 其他使用此证书的子域
