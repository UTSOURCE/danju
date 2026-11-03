import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {ModalController, NavParams, IonButtons, IonContent, IonHeader, IonIcon, IonImg, IonToolbar } from '@ionic/angular';
@Component({
    selector: 'app-bigimg',
    templateUrl: './bigimg.page.html',
    styleUrls: ['./bigimg.page.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [IonButtons, IonContent, IonHeader, IonIcon, IonImg, IonToolbar],
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
