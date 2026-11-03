import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Router} from '@angular/router';
import {DataService, NativeService} from '../../service';
import {NavController, IonButton, IonContent, IonInput, IonItem, IonLabel } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule, IonButton, IonContent, IonInput, IonItem, IonLabel],
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
        }).catch(() => {
            this.photoService.hideLoading();
            this.photoService.showToast('网络异常，请检查网络后重试');
        });
    }
}
