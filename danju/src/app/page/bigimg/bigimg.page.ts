import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
@Component({
  selector: 'app-bigimg',
  templateUrl: './bigimg.page.html',
  styleUrls: ['./bigimg.page.scss'],
})
export class BigimgPage implements OnInit {
  url = '';
  constructor(public modalCtrl: ModalController, navParams: NavParams) {
    this.url = navParams.get('url');
    console.log(this.url);
  }

  ngOnInit() {
  }
  goBack() {
    this.modalCtrl.dismiss();
  }
}
