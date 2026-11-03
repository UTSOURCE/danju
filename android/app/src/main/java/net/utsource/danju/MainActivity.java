package net.utsource.danju;

import android.os.Bundle;
import android.net.http.SslError;
import android.util.Log;
import android.webkit.SslErrorHandler;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "DanjuSSL";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // 业务决策：debug 与 release 正式包均放行 SSL 证书错误。
        // 原因：*.utsource.net 证书链（WoTrus/Sectigo R46）不在部分 Android 设备系统信任库中，
        // 为保证服务端证书再出问题时 App 仍可用，客户端不因证书错误中断请求。
        // 证书问题及服务端修复方案见 docs/ssl-certificate-fix.md。
        // 注意：放行时会打 TAG=DanjuSSL 的警告日志，便于在 logcat 中排查真实证书故障。
        bridge.getWebView().setWebViewClient(new BridgeWebViewClient(bridge) {
            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                Log.w(TAG, "SSL 证书错误已放行: " + error.toString());
                handler.proceed();
            }
        });
    }
}
