import { Injectable } from '@angular/core';
import { CookieService as BaseCookieService } from 'ngx-cookie-service';
import { LoginResponseModel, UserModel } from '../Utils/Models';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor(
    private cookieService: BaseCookieService
  ) { }

  isLoggedIn(): boolean {
    const dataFromCookie = this.cookieService.get('loggedUser').trim();
    if (dataFromCookie.length === 0) {
      return false;
    }
    return true;
  }

  saveLoginDataInCookies(loginData: LoginResponseModel): void {
    let dataToSave: string;
    dataToSave = loginData.userId + '|' +
      loginData.email + '|' +
      loginData.name + '|' +
      loginData.phone + '|' +
      loginData.joinedOn + '|' +
      loginData.userType;
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 7);
    this.cookieService.set('loggedUser', dataToSave, expiredDate, '/');
  }

  removeLoginDataFromCookies(): void {
    this.cookieService.delete('loggedUser');
  }

  getUserdataFromCookies(): UserModel {
    const dataFromCookie = this.cookieService.get('loggedUser').trim();
    if (dataFromCookie.length !== 0) {
      const userArray = dataFromCookie.split('|');
      const userData: UserModel = new UserModel();
      userData.userId = userArray[0];
      userData.email = userArray[1];
      userData.name = userArray[2];
      userData.phone = userArray[3];
      userData.joinedOn = userArray[4];
      userData.userType = parseInt(userArray[5]);
      return userData;
    }
    return null;
  }

  getUserType(): number {
    return this.getUserdataFromCookies() == null ? null : this.getUserdataFromCookies().userType;
  }

}
