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
    loadComponent: () => import('./page/login/login.page').then(m => m.LoginPage),
    canMatch: [CheckTutorial]
  },
  {
    path: 'home',
    loadComponent: () => import('./page/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'home/:date',
    loadComponent: () => import('./page/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'imglist/:id',
    loadComponent: () => import('./page/imglist/imglist.page').then(m => m.ImglistPage)
  },
  {
    path: 'addimg',
    loadComponent: () => import('./page/addimg/addimg.page').then(m => m.AddimgPage)
  },
  {
    path: 'addimg/:time',
    loadComponent: () => import('./page/addimg/addimg.page').then(m => m.AddimgPage)
  },
  {
    path: 'bigimg',
    loadComponent: () => import('./page/bigimg/bigimg.page').then(m => m.BigimgPage)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
