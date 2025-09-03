import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DataService, NativeService} from '../../service';
import {NavController} from '@ionic/angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: false
})
export class LoginPage implements OnInit {
    UserName = '';
    PassWord = '';

    constructor(public http: DataService,
                public navCtrl: NavController,
                public photoService: NativeService ) {
    }

    ngOnInit() {
        const u = localStorage.getItem('UserName');
        if (u) { this.UserName = u; }
        const p = localStorage.getItem('PassWord');
        if (p) { this.PassWord = p; }
    }

    gohome() {
        this.photoService.showLoading();
        this.http.login(this.UserName, this.PassWord).then((res: any) => {
            this.photoService.hideLoading();
            if (res.data.Status === 1) {
                localStorage.setItem('ISlogin', 'true');
                localStorage.setItem('UserName', this.UserName);
                localStorage.setItem('PassWord', this.PassWord);
                // this.router.navigate(['/home']);
                this.navCtrl.navigateRoot('/home');
            }else {
                this.photoService.showToast(res.data.Message);
            }
        });
    }
}
