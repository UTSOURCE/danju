import { Component, OnInit } from "@angular/core";
import { ActionSheetController, MenuController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { ActivatedRoute, Router } from "@angular/router";
import { DataService, NativeService } from "../../service";
import { Camera } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
// declare var window;
@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  newitemimg = [];
  itemimgurl = [];
  UpTime = "";
  constructor(
    private storage: Storage,
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
    });
    this.photoService.showLoading();
    let shuliang = 0;
    const isWeb = Capacitor.getPlatform() === "web";
    for (const item of result.photos) {
      const path = isWeb ? item.webPath : item.path;
      this.photoService.shangchuanFlie(path).then((data: any) => {
        console.log(data, "上传后");
        if (data && data.responseCode === 200) {
          console.log(JSON.parse(data.response));
          data.response = JSON.parse(data.response);
          // this.olditemimg.push(data.response.SourceFileName);
          this.newitemimg.push(data.response.FileName);
          // this.itemimgurl.push(data.reqUri);
          this.http.imgName.push(
            "https://upup.utsource.net/" + data.response.FileName,
          );
        }
        shuliang = shuliang + 1;
        if (result.photos.length === shuliang) {
          this.photoService.hideLoading();
          this.router.navigate(["/addimg"]);
        }
      });
    }
  }
  Logout() {
    this.storage.remove("ISlogin");
    this.router.navigate(["/login"]);
  }
}
