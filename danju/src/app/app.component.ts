import {Component, OnInit} from '@angular/core';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {MenuController, Platform} from '@ionic/angular';
import {Router} from '@angular/router';
import {DataService} from './service';

// import { Plugins, StatusBarStyle } from '@capacitor/core';
@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
    public selectedIndex = 0;
    public myDate;

    constructor(
        private platform: Platform,
        public splashScreen: SplashScreen,
        public statusBar: StatusBar,
        private router: Router,
        public http: DataService,
        private menu: MenuController
    ) {
        this.initializeApp();
    }

    async initializeApp() {
        // const { SplashScreen, StatusBar } = Plugins;
        // try {
        //   await SplashScreen.hide();
        //   // await StatusBar.setStyle({ style: StatusBarStyle.Light });
        //   // if (this.platform.is('android')) {
        //   //   StatusBar.setBackgroundColor({ color: '#D22E35' });
        //   // }
        // } catch (err) {
        //   console.log('This is normal in a browser', err);
        // }
        this.platform.ready().then(() => {
            // this.statusBar.styleDefault();
            this.splashScreen.hide();
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
