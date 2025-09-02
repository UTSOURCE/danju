import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BigimgPage } from './bigimg.page';

const routes: Routes = [
  {
    path: '',
    component: BigimgPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BigimgPageRoutingModule {}
