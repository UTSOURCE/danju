import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DataService, NativeService } from "../../service";
import { Storage } from "@ionic/storage";
import { AppConfig } from "../../config/env";
import { Camera } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";

@Component({
  selector: "app-addimg",
  templateUrl: "./addimg.page.html",
  styleUrls: ["./addimg.page.scss"],
})
export class AddimgPage implements OnInit {
  imgUrl = AppConfig.imgUrl();
  list = 0;
  Cate = "深圳月结";
  allCate = [];
  Remark = "";
  Imgs;
  time = "";
  UpTime = "";
  isImgs = false;
  allimg;
  Ids = [];
  newimg = [];
  oldCate;
  constructor(
    private router: Router,
    public route: ActivatedRoute,
    public photoService: NativeService,
    private storage: Storage,
    public changeDetectorRef: ChangeDetectorRef,
    public http: DataService,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.oldCate = params.Cate;
      console.log(this.oldCate);
    });
    this.storage.get("Cate").then((name) => {
      if (name) {
        this.Cate = name;
      }
    });
    this.allCate = this.http.allCate;
  }
  ionViewDidEnter() {
    // console.log(this.http.imgName);
    this.UpTime = this.route.snapshot.params.time;
    this.Imgs = this.http.imgName;
    console.log(this.UpTime);
    if (this.UpTime) {
      this.isImgs = true;
      this.Imgs = [];
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
        this.storage.remove("ISlogin");
        this.router.navigate(["/login"]);
        return;
      }
      if (res.data.Status === 1) {
        this.Cate = res.data.ImgPage.ResultList[0].Cate;
        this.Remark = res.data.ImgPage.ResultList[0].Remark;
        this.allimg = res.data.ImgPage;
        for (const item of res.data.ImgPage.ResultList) {
          this.Imgs.push(item.ImageName);
          this.Ids.push(item.id);
          // this.http.imgName.push(item.ImageName);
        }
      }
    });
  }
  upload() {
    this.http.imgName = [];
    this.storage.set("Cate", this.Cate);
    this.photoService.showLoading();
    for (const item of this.Imgs) {
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
  dele(i) {
    if (this.isImgs) {
      console.log();
      const data = {
        id: this.allimg.ResultList[i].id,
      };
      this.http.delimages(data).then((res: any) => {
        this.allimg.ResultList.splice(i, 1);
        this.Imgs.splice(i, 1);
        this.Ids.splice(i, 1);
        console.log(this.Ids);
      });
    } else {
      this.Imgs.splice(i, 1);
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
      const path = isWeb ? item.webPath : item.path;
      this.photoService.shangchuanFlie(path).then((data: any) => {
        // console.log(data, '上传后');
        if (data && data.responseCode === 200) {
          console.log(JSON.parse(data.response));
          data.response = JSON.parse(data.response);
          // this.newimg.push(data.response.FileName);
          // https://utcdn.utsource.info/m_180x135/
          // https://utcdn.utsource.info/f_e98152389ce64b368aa0add5277ecbde.png
          this.Imgs.unshift(
            "https://upup.utsource.net/" + data.response.FileName,
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
