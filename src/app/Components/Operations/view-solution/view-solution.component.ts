import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-solution',
  templateUrl: './view-solution.component.html',
  styleUrls: ['./view-solution.component.css']
})
export class ViewSolutionComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goBack(): void {
    this.router.navigateByUrl('dashboard');
  }

}
