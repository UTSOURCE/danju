import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class CheckTutorial  {
  constructor(private router: Router) {}

  canMatch() {
    return Promise.resolve(localStorage.getItem('ISlogin')).then(res => {
      if (res) {
        this.router.navigate(['/home']);
        return false;
      } else {
        return true;
      }
    });
  }
}
