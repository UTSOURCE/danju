import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CheckTutorial } from './providers/check-tutorial.service';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./page/login/login.module').then( m => m.LoginPageModule),
    canLoad: [CheckTutorial]
  },
  {
    path: 'home',
    loadChildren: () => import('./page/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'home/:date',
    loadChildren: () => import('./page/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'imglist/:id',
    loadChildren: () => import('./page/imglist/imglist.module').then( m => m.ImglistPageModule)
  },
  {
    path: 'addimg',
    loadChildren: () => import('./page/addimg/addimg.module').then( m => m.AddimgPageModule)
  },
  {
    path: 'addimg/:time',
    loadChildren: () => import('./page/addimg/addimg.module').then( m => m.AddimgPageModule)
  },
  {
    path: 'bigimg',
    loadChildren: () => import('./page/bigimg/bigimg.module').then( m => m.BigimgPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
