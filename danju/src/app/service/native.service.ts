import { Injectable } from '@angular/core';
import { ToastController, LoadingController} from '@ionic/angular';
import {AppConfig} from '../config/env';
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer/ngx';
@Injectable({
  providedIn: 'root'
})
export class NativeService {
  public loadRunning = false;
  constructor(
              public transfer: FileTransfer,
              public toastController: ToastController,
              public loadingController: LoadingController
  ) {}
  /**
   * 上传文件
   */
  shangchuanFlie = (value) => {
    console.log(value.toString().substr(value.toString().lastIndexOf('/') + 1));
    return new Promise(resolve => {
      const fileTransfer: FileTransferObject = this.transfer.create();
      const options: FileUploadOptions = {
        fileKey: 'file',
        fileName: value.toString().substr(value.toString().lastIndexOf('/') + 1),
        headers: {}
      };
      const reqUri = this.getUrl();
      console.log(reqUri);
      // 第一个参数是文件的路径，第二个参数是服务器的url，第二个参数也可以是encodeURI(reqUri)
      fileTransfer.upload(value, encodeURI(reqUri), options).then((data: any) => {
            data.reqUri = reqUri;
            resolve(data);
          },
          err => {
            this.showToast('Fail!', err);
          }
      );
    });
  }
  /**
   * 统一调用此方法显示提示信息
   * @param message 信息内容
   * @param duration 显示时长
   */
  showToast = async (messages: string = '操作完成', durations: number = 2000) => {
    const toast = await this.toastController.create({
      message: messages,
      position: 'middle',
      duration: durations
    });
    await toast.present();
  }
  async showLoading(content: string = '') {
    this.loadRunning = true;
    return await this.loadingController.create({})
        .then(a => {
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
    const action = AppConfig.uploadfile() + '?MaxSize=10&Unit=MB&FileCategory=Bill&code=' + new Date().getTime().toString();
    console.log(action);
    return action;
  }

  upload(option: any) {
    if (typeof XMLHttpRequest === 'undefined') {
      return;
    }
    const xhr = new XMLHttpRequest();
    const Zthis = this;
    const formData = new FormData();
    if (option.data) {
      Object.keys(option.data).forEach(key => {
        formData.append(key, option.data[key]);
      });
    }
    const action = this.getUrl();
    formData.append(option.filename, option.file, option.file.name);
    xhr.onerror = function error(e) {
      option.onError(e);
    };
    xhr.onload = function onload() {
      if (xhr.status < 200 || xhr.status >= 300) {
        return option.onError(Zthis.getError(action, option, xhr));
      }

      option.onSuccess(Zthis.getBody(xhr));
    };

    xhr.open('post', action, true);
    if (option.withCredentials && 'withCredentials' in xhr) {
      xhr.withCredentials = true;
    }
    const headers = option.headers || {};

    for (const item in headers) {
      if (headers.hasOwnProperty(item) && headers[item] !== null) {
        xhr.setRequestHeader(item, headers[item]);
      }
    }
    xhr.send(formData);
    return xhr;
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
    err.method = 'post';
    err.url = action;
    return err;
  }
}

// interface Photo {
//   filepath: string;
//   webviewPath: string;
//   base64?: string;
// }
