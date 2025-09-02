import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImglistPageRoutingModule } from './imglist-routing.module';

import { ImglistPage } from './imglist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImglistPageRoutingModule
  ],
  declarations: [ImglistPage]
})
export class ImglistPageModule {}
