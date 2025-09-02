import {Component, OnInit} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {DataService, NativeService} from '../../service';
import {NavController} from '@ionic/angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    UserName = '';
    PassWord = '';

    constructor(public http: DataService,
                public navCtrl: NavController,
                private storage: Storage, public photoService: NativeService ) {
    }

    ngOnInit() {
        this.storage.get('UserName').then((name) => {
            if (name){
                this.UserName = name;
            }
        });
        this.storage.get('PassWord').then((name) => {
            if (name){
                this.PassWord = name;
            }
        });
    }

    gohome() {
        this.photoService.showLoading();
        this.http.login(this.UserName, this.PassWord).then((res: any) => {
            this.photoService.hideLoading();
            if (res.data.Status === 1) {
                this.storage.set('ISlogin', true);
                this.storage.set('UserName', this.UserName);
                this.storage.set('PassWord', this.PassWord);
                // this.router.navigate(['/home']);
                this.navCtrl.navigateRoot('/home');
            }else {
                this.photoService.showToast(res.data.Message);
            }
        });
    }
}
