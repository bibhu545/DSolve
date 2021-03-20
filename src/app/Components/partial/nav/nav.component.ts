import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/Services/account.service';
import { CookieService } from 'src/app/Services/cookie.service';
import { HttpService } from 'src/app/Services/http.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  isLoggedIn = false;
  constructor(
    private accountService: AccountService,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.accountService.loggedIn$.subscribe(data => {
      this.isLoggedIn = data;
    });
   }

  ngOnInit(): void {
    this.isLoggedIn = this.cookieService.isLoggedIn();
  }

  logout(): void {
    this.cookieService.removeLoginDataFromCookies();
    this.accountService.setLoggedIn(false);
    this.router.navigateByUrl('/');
  }

}
