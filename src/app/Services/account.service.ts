import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private loggedIn: Subject<boolean> = new Subject<boolean>();
  loggedIn$ = this.loggedIn.asObservable();

  private userType: Subject<number> = new Subject<number>();
  userType$ = this.userType.asObservable();

  setLoggedIn(value: boolean): void {
    this.loggedIn.next(value);
  }

  setUserType(value: number): void {
    this.userType.next(value);
  }

  constructor() { }
}
