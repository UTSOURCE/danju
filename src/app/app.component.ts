import {Component, OnInit} from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
// import { StatusBar, Style as StatusBarStyle } from '@capacitor/status-bar';
import {MenuController, Platform} from '@ionic/angular';
import {Router} from '@angular/router';
import {DataService} from './service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
    public selectedIndex = 0;
    public myDate;

    constructor(
        private platform: Platform,
        private router: Router,
        public http: DataService,
        private menu: MenuController
    ) {
        this.initializeApp();
    }

    async initializeApp() {
        // try {
        //   await SplashScreen.hide();
        //   // await StatusBar.setStyle({ style: StatusBarStyle.Light });
        //   // if (this.platform.is('android')) {
        //   //   StatusBar.setBackgroundColor({ color: '#D22E35' });
        //   // }
        // } catch (err) {
        //   console.log('This is normal in a browser', err);
        // }
        this.platform.ready().then(async () => {
            // await StatusBar.setStyle({ style: StatusBarStyle.Dark }); // 可按需设置
            try {
              await SplashScreen.hide();
            } catch (err) {
              // 浏览器环境下无原生 SplashScreen，可忽略
            }
            this.http.cates().then((res: any) => {
                this.http.allCate = res.data;
            });
        });
    }
    updateMyDate(date) {
        this.myDate = date.substring(0, 10);
    }

    gohome(i) {
        this.menu.close();
        if (i) {
            this.router.navigate(['/home', this.myDate]);
        } else {
            this.router.navigate(['/home']);
        }
    }

    ngOnInit() {
        // const path = window.location.pathname.split('folder/')[1];
        // if (path !== undefined) {
        //   this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
        // }
    }
}
