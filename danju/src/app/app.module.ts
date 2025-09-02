import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {HttpClientModule} from '@angular/common/http';
import {httpInterceptorProviders} from '../app/service/httpinterceptors';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {IonicStorageModule} from '@ionic/storage';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import {FileTransfer} from '@ionic-native/file-transfer/ngx';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ImagePicker,
    FileTransfer,
    httpInterceptorProviders,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
