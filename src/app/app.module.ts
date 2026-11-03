import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicRouteStrategy, provideIonicAngular } from "@ionic/angular";
import { provideHttpClient, withInterceptorsFromDi, withXhr } from "@angular/common/http";
import { httpInterceptorProviders } from "../app/service/httpinterceptors";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
@NgModule({
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppComponent,
        AppRoutingModule], providers: [
        provideIonicAngular(),
        httpInterceptorProviders,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
    ] })
export class AppModule {}
