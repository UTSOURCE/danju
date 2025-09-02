import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddimgPageRoutingModule } from './addimg-routing.module';

import { AddimgPage } from './addimg.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddimgPageRoutingModule
  ],
  declarations: [AddimgPage]
})
export class AddimgPageModule {}
