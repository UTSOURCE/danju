import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddimgPage } from './addimg.page';

const routes: Routes = [
  {
    path: '',
    component: AddimgPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddimgPageRoutingModule {}
