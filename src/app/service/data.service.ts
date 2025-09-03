import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../app/config/env';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    imgName = [];
    allCate = [];
    constructor(public http: HttpClient) {}
    xinxi(sid: any, lan: any, tk: any, cod: any, cty: any) { // 公共信息存储
        if (sid){
            localStorage.setItem('_sid', sid);
        }
        if (tk) {
            localStorage.setItem('_tk', tk);
        }
        if (cty) {
            localStorage.setItem('_cty', cty);
        }
    }
    getcanshu() {
        const publiccanshu = {
            sid: localStorage.getItem('_sid'),
            lan: localStorage.getItem('_lan'),
            tk: localStorage.getItem('_tk'),
            stp: 1,
            cty: localStorage.getItem('_cty'),
            cod: localStorage.getItem('_cod')
        };
        return publiccanshu;
    }
    sharepost(body) {
        return new Promise((resolve, reject) => {
            this.http.post(AppConfig.postUrl() + body.cmd, Object.assign(body, this.getcanshu())).subscribe((res: any) => {
                if (!localStorage.getItem('_sid')) {
                    this.xinxi(res.sid, res.lan, res.tk, res.cod, res.cty);
                }
                resolve(res);
            }, err => {
                reject(err);
            });
        });
    }
    login(UserName, PassWord) { // 登录
        const body = {
            cmd: 'bill/account/login',
            data: '{"UserName":"' + UserName + '","PassWord":"' + PassWord + '"}'
        };
        return new Promise((resolve, reject) => {
            this.http.post(AppConfig.postUrl() + body.cmd, body).subscribe((res: any) => {
                this.xinxi(res.sid, res.lan, res.tk, res.cod, res.cty);
                resolve(res);
            }, err => {
                reject(err);
            });
        });
    }
    cates() {
        const body = {
            cmd: 'bill/image/cates',
            data: '{}'
        };
        return this.sharepost(body);
    }
    addimg(data) {
        const body = {
            cmd: 'bill/image/add',
            data: JSON.stringify(data)
        };
        return this.sharepost(body);
    }
    images(data) {
        const body = {
            cmd: 'bill/image/images',
            data: JSON.stringify(data)
        };
        return this.sharepost(body);
    }
    imagesList(data) {
        const body = {
            cmd: 'bill/image/list',
            data: JSON.stringify(data)
        };
        return this.sharepost(body);
    }
    delimages(data) {
        const body = {
            cmd: 'bill/image/del',
            data: JSON.stringify(data)
        };
        return this.sharepost(body);
    }
    updateimages(data) {
        const body = {
            cmd: 'bill/image/update',
            data: JSON.stringify(data)
        };
        return this.sharepost(body);
    }
}
