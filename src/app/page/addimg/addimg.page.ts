import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DataService, NativeService } from "../../service";
import { AppConfig } from "../../config/env";
import { Camera } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonRow, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar } from "@ionic/angular";
import { FormsModule } from '@angular/forms';

@Component({
    selector: "app-addimg",
    templateUrl: "./addimg.page.html",
    styleUrls: ["./addimg.page.scss"],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule, IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonRow, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar],
})
export class AddimgPage implements OnInit {
  imgUrl = AppConfig.imgUrl();
  list = 0;
  Cate = "深圳月结";
  allCate = signal<any[]>([]);
  Remark = "";
  Imgs = signal<string[]>([]);
  time = "";
  UpTime = "";
  isImgs = false;
  allimg: any;
  Ids = [];
  newimg = [];
  oldCate: string;
  constructor(
    private router: Router,
    public route: ActivatedRoute,
    public photoService: NativeService,
    public changeDetectorRef: ChangeDetectorRef,
    public http: DataService,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.oldCate = params.Cate;
      console.log(this.oldCate);
    });
    const name = localStorage.getItem("Cate");
    if (name) {
      this.Cate = name;
    }
    this.allCate.set(this.http.allCate);
  }
  ionViewDidEnter() {
    // console.log(this.http.imgName);
    this.UpTime = this.route.snapshot.params.time;
    this.Imgs.set(this.http.imgName);
    console.log(this.UpTime);
    if (this.UpTime) {
      this.isImgs = true;
      this.Imgs.set([]);
      this.getimages();
    }
  }
  getimages() {
    const data = {
      PageIndex: 1,
      PageSize: 100,
      Cate: this.oldCate,
      UpTime: this.UpTime + " 00:00:00",
    };
    this.http.images(data).then((res: any) => {
      console.log(res);
      if (res.rtn === "LoginEx") {
        localStorage.removeItem("ISlogin");
        this.router.navigate(["/login"]);
        return;
      }
      if (res.data.Status === 1) {
        this.Cate = res.data.ImgPage.ResultList[0].Cate;
        this.Remark = res.data.ImgPage.ResultList[0].Remark;
        this.allimg = res.data.ImgPage;
        const imgs: string[] = [];
        for (const item of res.data.ImgPage.ResultList) {
          imgs.push(item.ImageName);
          this.Ids.push(item.id);
        }
        this.Imgs.set(imgs);
      }
    });
  }
  upload() {
    this.http.imgName = [];
    localStorage.setItem("Cate", this.Cate);
    this.photoService.showLoading();
    for (const item of this.Imgs()) {
      if (item.indexOf("https://upup.utsource.net/") !== -1) {
        this.newimg.push(item.replace("https://upup.utsource.net/", ""));
      }
    }
    if (this.isImgs) {
      if (this.newimg.length > 0) {
        const data = {
          Cate: this.Cate,
          Remark: this.Remark,
          UpTime: this.UpTime + " 00:00:00",
          Imgs: this.newimg,
        };
        this.http.addimg(data).then((res: any) => {
          console.log(res);
          this.updateimages();
        });
      } else {
        this.updateimages();
      }
    } else {
      const data = {
        Cate: this.Cate,
        Remark: this.Remark,
        UpTime: "",
        Imgs: this.newimg,
      };
      this.http.addimg(data).then((res: any) => {
        this.photoService.hideLoading();
        this.updateimages();
        if (res.data.Status === 1) {
          this.router.navigate(["/home"]);
        }
      });
    }
  }
  onselet() {
    console.log(this.Cate);
  }
  dele(i: number) {
    if (this.isImgs) {
      console.log();
      const data = {
        id: this.allimg.ResultList[i].id,
      };
      this.http.delimages(data).then((res: any) => {
        this.allimg.ResultList.splice(i, 1);
        this.Imgs.update((a) => { a.splice(i, 1); return [...a]; });
        this.Ids.splice(i, 1);
        console.log(this.Ids);
      });
    } else {
      this.Imgs.update((a) => { a.splice(i, 1); return [...a]; });
    }
  }
  async takePicture() {
    const result = await Camera.pickImages({
      quality: 70,
      width: 1920,
      height: 1440,
    });
    this.photoService.showLoading();
    let shuliang = 0;
    const isWeb = Capacitor.getPlatform() === "web";
    for (const item of result.photos) {
      const path = isWeb ? item.webPath : (item.path as string);
      this.photoService.shangchuanFlie(path).then((data: any) => {
        // console.log(data, '上传后');
        if (data && data.responseCode === 200) {
          console.log(JSON.parse(data.response));
          data.response = JSON.parse(data.response);
          // this.newimg.push(data.response.FileName);
          // https://utcdn.utsource.info/m_180x135/
          // https://utcdn.utsource.info/f_e98152389ce64b368aa0add5277ecbde.png
          this.Imgs.update(
            (a) => ["https://upup.utsource.net/" + data.response.FileName, ...a],
          );
        }
        shuliang = shuliang + 1;
        if (result.photos.length === shuliang) {
          this.photoService.hideLoading();
          // this.router.navigate(['/addimg']);
          this.changeDetectorRef.markForCheck();
          this.changeDetectorRef.detectChanges();
        }
      });
    }
  }
  updateimages() {
    const data = {
      Cate: this.Cate,
      Remark: this.Remark,
      Ids: this.Ids,
    };
    this.http.updateimages(data).then((res: any) => {
      this.photoService.hideLoading();
      this.router.navigate(["/home"]);
      // console.log(res);
      // if (res.data.Status === 1){
      //   this.router.navigate(['/home']);
      // }
    });
  }
}
