import { Component, OnInit } from "@angular/core";
import { ActionSheetController, MenuController } from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { DataService, NativeService } from "../../service";
import { Camera } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
import { AppConfig } from "../../config/env";
import { ungzip } from "pako";
// declare var window;
@Component({
    selector: "app-home",
    templateUrl: "./home.page.html",
    styleUrls: ["./home.page.scss"],
    standalone: false
})
export class HomePage implements OnInit {
  newitemimg = [];
  itemimgurl = [];
  UpTime = "";
  constructor(
    private router: Router,
    public http: DataService,
    public photoService: NativeService,
    public actionSheetController: ActionSheetController,
    public route: ActivatedRoute,
    private menu: MenuController,
  ) {}
  ionViewDidEnter() {
    if (this.route.snapshot.params.date) {
      this.UpTime = this.route.snapshot.params.date + " 00:00:00";
    } else {
      this.UpTime = "";
    }
    this.getimagesList(this.UpTime);
  }
  ngOnInit() {}
  // 将以字符形式返回的二进制内容转换为 Uint8Array
  private strToBytes(input: string): Uint8Array {
    const arr = new Uint8Array(input.length);
    for (let i = 0; i < input.length; i++) {
      arr[i] = input.charCodeAt(i) & 0xff;
    }
    return arr;
  }

  // 尝试对字符串进行 gzip 解压，成功则返回解压后的文本
  private tryGunzipString(input: string): string | null {
    try {
      // gzip 魔数 0x1f 0x8b
      const looksGzip = input.length > 2 && (input.charCodeAt(0) & 0xff) === 0x1f && (input.charCodeAt(1) & 0xff) === 0x8b;
      const bytes = this.strToBytes(input);
      const out = ungzip(bytes, { to: "string" }) as string;
      return out || (looksGzip ? "" : null);
    } catch (e) {
      return null;
    }
  }

  // 解析形如 <script>location.href='URL?query...'</script> 的内容，提取 query 参数
  private parseRedirectScript(html: string): any | null {
    const m = html.match(/location\.href\s*=\s*'([^']+)'/i);
    if (!m) return null;
    try {
      const target = m[1];
      const url = new URL(target);
      const q = url.searchParams;
      return {
        Status: Number(q.get("status")) || 0,
        Message: q.get("message") || "",
        Code: q.get("code") || "",
        FileName: q.get("filename") || "",
        ViewName: q.get("viewname") || "",
        SourceFileName: q.get("SourceFileName") || "",
      };
    } catch (e) {
      return null;
    }
  }
  getimagesList(time) {
    const data = {
      UpTime: time,
    };
    this.http.imagesList(data).then((res: any) => {
      if (res.rtn === "LoginEx") {
        this.Logout();
        return;
      }
      if (res.data.Status === 1) {
        this.itemimgurl = res.data.Imgs;
      }
    });
  }
  async takePicture() {
    const result = await Camera.pickImages({
      quality: 80,
      width: 1920,
      height: 1440,
      limit: 1,
    });
    this.photoService.showLoading();
    let shuliang = 0;
    console.log(result);
    for (const item of result.photos) {
      console.log(item);
      const path = item.webPath;
      this.photoService
        .shangchuanFlie(path)
        .then((data: any) => {
          console.log(data, "上传后");
          const code = typeof data?.responseCode === "string" ? parseInt(data.responseCode, 10) : data?.responseCode;
          if (data && code === 200) {
            let resp: any = data.response;
            if (typeof resp === "string") {
              try {
                const parsed = JSON.parse(resp);
                resp = parsed;
              } catch (e) {
                // 尝试解压 gzip 并解析可能的跳转脚本
                const unzipped = this.tryGunzipString(resp);
                if (typeof unzipped === "string") {
                  const maybeObj = this.parseRedirectScript(unzipped);
                  if (maybeObj && maybeObj.FileName) {
                    resp = maybeObj;
                  } else {
                    // 若不是脚本，尝试当作 JSON 再解析一次
                    try {
                      resp = JSON.parse(unzipped);
                    } catch (e2) {
                      this.photoService.showToast("返回内容无法解析(压缩/格式)，请重试或联系后台。");
                      console.warn("无法解析响应(解压后)", unzipped);
                    }
                  }
                } else {
                  // 非 gzip 或解压失败，尝试直接从字符串中提取脚本
                  const maybeObj = this.parseRedirectScript(resp);
                  if (maybeObj && maybeObj.FileName) {
                    resp = maybeObj;
                  } else {
                    this.photoService.showToast("返回内容无法解析，请重试或联系后台。");
                    console.warn("响应体无法 JSON.parse，原始值:", resp);
                  }
                }
              }
            }
            data.response = resp;
            // this.olditemimg.push(data.response.SourceFileName);
            this.newitemimg.push(data.response.FileName);
            // this.itemimgurl.push(data.reqUri);
            this.http.imgName.push(
              `${AppConfig.newUPUrl()}/` + data.response.FileName,
            );
          }
        })
        .catch((err) => {
          console.error("上传失败", err);
          this.photoService.showToast("上传失败", 2000);
        })
        .finally(() => {
          shuliang = shuliang + 1;
          if (result.photos.length === shuliang) {
            this.photoService.hideLoading();
            this.router.navigate(["/addimg"]);
          }
        });
    }
  }
  Logout() {
    localStorage.removeItem("ISlogin");
    this.router.navigate(["/login"]);
  }
}
