import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  addDHU(): void {
    this.router.navigateByUrl('/add-dhu');
  }

  viewSolutions(): void {
    this.router.navigateByUrl('/view-solution');
  }

  plotGraph(): void {
    this.router.navigateByUrl('/plot-graph');
  }

  viewData(): void {
    this.router.navigateByUrl('/view-data');
  }

}
