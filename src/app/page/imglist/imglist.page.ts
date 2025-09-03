import { Component, OnInit } from '@angular/core';
import {DataService} from '../../service';
import {ActivatedRoute, Router} from '@angular/router';
import { ModalController } from '@ionic/angular';
import {BigimgPage} from '../bigimg/bigimg.page';
@Component({
    selector: 'app-imglist',
    templateUrl: './imglist.page.html',
    styleUrls: ['./imglist.page.scss'],
    standalone: false
})
export class ImglistPage implements OnInit {
  UpTime;
  constructor(public http: DataService, public route: ActivatedRoute, public modalController: ModalController) { }
  PageIndex = 1;
  Imgs = [];
  Cate;
  oldCate;
  Remark;
  // ionViewDidEnter() {
  //   this.getimages();
  // }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.oldCate = params.Cate;
    });
    this.UpTime = this.route.snapshot.params.id;
    this.getimages();
  }
  getimages(){
    const data = {
      Cate: this.oldCate,
      PageIndex: this.PageIndex,
      PageSize: 100,
      UpTime: this.UpTime + ' 00:00:00'
    };
    this.http.images(data).then((res: any) => {
      console.log(res);
      if (res.data.Status === 1){
        this.Cate = res.data.ImgPage.ResultList[0].Cate;
        this.Remark = res.data.ImgPage.ResultList[0].Remark;
        for (const item of res.data.ImgPage.ResultList){
          this.Imgs.push(item.ImageName);
          // this.http.imgName.push(item.ImageName);
        }
      }
    });
  }
  async open(i) {
    const modal = await this.modalController.create({
      component: BigimgPage,
      componentProps: {url: this.Imgs[i].replace('_180x135', 'other')}
    });
    return await modal.present();
  }
}
