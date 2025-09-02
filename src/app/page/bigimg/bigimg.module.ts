import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BigimgPageRoutingModule } from './bigimg-routing.module';

import { BigimgPage } from './bigimg.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BigimgPageRoutingModule
  ],
  declarations: [BigimgPage]
})
export class BigimgPageModule {}
