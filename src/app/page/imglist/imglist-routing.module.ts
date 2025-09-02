import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImglistPage } from './imglist.page';

const routes: Routes = [
  {
    path: '',
    component: ImglistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImglistPageRoutingModule {}
