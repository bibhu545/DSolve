import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { CommonService } from './Services/common.service';
import { HttpService } from './Services/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  title = 'dsolve';
  onlineTestMode = false;
  isLoading = false;

  constructor(
    private commonService: CommonService,
    private cd: ChangeDetectorRef
  ) {

  }

  ngAfterViewInit(): void {
    this.commonService.loading$.subscribe(data => {
      this.isLoading = data;
    });
    this.cd.detectChanges();
  }
}
