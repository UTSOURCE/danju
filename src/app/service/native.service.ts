import { Injectable } from "@angular/core";
import { ToastController, LoadingController } from "@ionic/angular";
import { AppConfig } from "../config/env";
import { FileTransfer, UploadFileOptions } from "@capacitor/file-transfer";
import { Capacitor } from "@capacitor/core";

@Injectable({
  providedIn: "root",
})
export class NativeService {
  public loadRunning = false;
  constructor(
    public toastController: ToastController,
    public loadingController: LoadingController,
  ) {}
  /**
   * 上传文件
   */
  shangchuanFlie = async (path: string) => {
    const action = this.getUrl();
    try {
      let blob: Blob | undefined;
      let fileName: string;

      // Web 端：通过 fetch 读取 webPath 并转为 Blob
      const oldresponse = await fetch(path);
      console.log(oldresponse);
      blob = await oldresponse.blob();
      console.log(blob);
      const extension = (blob.type && blob.type.includes("/")) ? blob.type.split("/")[1] : "bin";
      fileName = `${new Date().getTime()}.${extension}`;

      console.log(fileName);
      console.log(action);

      // 通过 Promise 化的 upload 发送
      const response = await this.upload({
        file: blob,
        filename: fileName,
        data: {
          code: new Date().getTime().toString(),
        },
        action,
      });
      console.log(response);
      return { ...response, reqUri: action };
    } catch (err) {
      console.error(err);
      this.showToast("上传失败", 2000);
      throw err;
    }
  };
  /**
   * 统一调用此方法显示提示信息
   * @param message 信息内容
   * @param duration 显示时长
   */
  showToast = async (
    messages: string = "操作完成",
    durations: number = 2000,
  ) => {
    const toast = await this.toastController.create({
      message: messages,
      position: "middle",
      duration: durations,
    });
    await toast.present();
  };
  async showLoading(content: string = "") {
    this.loadRunning = true;
    return await this.loadingController.create({}).then((a) => {
      a.present().then(() => {
        if (!this.loadRunning) {
          a.dismiss();
          // a.dismiss().then(() => console.log('abort presenting'));
        }
        setTimeout(() => {
          // 最长显示20秒
          this.loadRunning = false;
          a.dismiss();
        }, 20000);
      });
    });
  }
  /**
   * 关闭loading
   */
  async hideLoading() {
    this.loadRunning = false;
    if (this.loadingController) {
      return await this.loadingController.dismiss();
    }
  }
  // 上传地址
  getUrl() {
    const action =
      AppConfig.uploadfile() +
      "?MaxSize=20&Unit=MB&FileCategory=Bill&code=" +
      new Date().getTime().toString();
    console.log(action);
    return action;
  }

  upload(option: { file: Blob; filename: string; data?: any; headers?: any; withCredentials?: boolean; action?: string; }): Promise<{ responseCode: number; response: any; }> {
    return new Promise((resolve, reject) => {
      if (typeof XMLHttpRequest === "undefined") {
        return reject(new Error("XMLHttpRequest is undefined"));
      }
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      if (option.data) {
        Object.keys(option.data).forEach((key) => {
          formData.append(key, option.data[key]);
        });
      }
      const action = option.action ?? this.getUrl();
      // 正确的字段名应为 file
      formData.append("file", option.file, option.filename);

      xhr.onerror = (e) => {
        reject(this.getError(action, option, xhr));
      };

      xhr.onload = () => {
        const body = this.getBody(xhr);
        if (xhr.status < 200 || xhr.status >= 300) {
          return reject(this.getError(action, option, xhr));
        }
        resolve({ responseCode: xhr.status, response: body });
      };

      xhr.open("post", action, true);
      if (option.withCredentials && "withCredentials" in xhr) {
        xhr.withCredentials = true;
      }
      const headers = option.headers || {};
      for (const item in headers) {
        if (headers.hasOwnProperty(item) && headers[item] !== null) {
          xhr.setRequestHeader(item, headers[item]);
        }
      }
      xhr.send(formData);
    });
  }

  getBody(xhr) {
    const text = xhr.responseText || xhr.response;
    if (!text) {
      return text;
    }

    try {
      return JSON.parse(text);
    } catch (e) {
      return text;
    }
  }

  getError(action, option, xhr) {
    let msg;
    if (xhr.response) {
      msg = `${xhr.response.error || xhr.response}`;
    } else if (xhr.responseText) {
      msg = `${xhr.responseText}`;
    } else {
      msg = `fail to post ${action} ${xhr.status}`;
    }

    const err: any = new Error(msg);
    err.status = xhr.status;
    err.method = "post";
    err.url = action;
    return err;
  }
}

// interface Photo {
//   filepath: string;
//   webviewPath: string;
//   base64?: string;
// }
