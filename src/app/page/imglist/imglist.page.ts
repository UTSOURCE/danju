import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import {DataService} from '../../service';
import {ActivatedRoute, Router} from '@angular/router';
import { ModalController, IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonHeader, IonImg, IonRow, IonTextarea, IonTitle, IonToolbar } from '@ionic/angular';
import {BigimgPage} from '../bigimg/bigimg.page';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
    selector: 'app-imglist',
    templateUrl: './imglist.page.html',
    styleUrls: ['./imglist.page.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule, RouterModule, IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonHeader, IonImg, IonRow, IonTextarea, IonTitle, IonToolbar],
})
export class ImglistPage implements OnInit {
  UpTime: string;
  constructor(public http: DataService, public route: ActivatedRoute, public modalController: ModalController) { }
  PageIndex = 1;
  Imgs = signal<string[]>([]);
  Cate: string;
  oldCate: string;
  Remark: string;
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
        const imgs: string[] = [];
        for (const item of res.data.ImgPage.ResultList){
          imgs.push(item.ImageName);
        }
        this.Imgs.set(imgs);
      }
    });
  }
  async open(i: number) {
    const modal = await this.modalController.create({
      component: BigimgPage,
      componentProps: {url: this.Imgs()[i].replace('_180x135', 'other')}
    });
    return await modal.present();
  }
}
