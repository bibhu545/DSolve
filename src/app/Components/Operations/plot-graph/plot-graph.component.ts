import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'src/app/Services/cookie.service';
import { HttpService } from 'src/app/Services/http.service';
import { CheckedModel, DDLModel, UserModel, ViewDataModel } from 'src/app/Utils/Models';
import { API_ENDPOINTS, Utils } from 'src/app/Utils/Utils';
import { DefectListModel } from '../view-data/view-data.component';
import { SolutionModel } from '../view-solution/view-solution.component';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-plot-graph',
  templateUrl: './plot-graph.component.html',
  styleUrls: ['./plot-graph.component.css']
})
export class PlotGraphComponent implements OnInit {

  viewForm: FormGroup;
  utils: Utils = new Utils();
  departments: DDLModel[] = [];
  defects: DDLModel[] = [];
  userData: UserModel = new UserModel();
  dateList: string[] = [];
  checkIdList: string[] = [];
  dhuList: CheckedModel[] = [];
  defectListModelData: DefectListModel[] = [];
  cumulativeList: number[] = [];
  precentageList: number[] = [];
  totalDefects: number[] = [];
  auditedPieces: number[] = [];
  totalByDefectList: number[] = [];
  showGrid = false;
  deptId: string;
  solutions: SolutionModel[] = [];

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = false;
  barChartPlugins = [pluginDataLabels];

  barChartData: ChartDataSets[] = [];

  constructor(
    private http: HttpService,
    private router: Router,
    private formBuilder: FormBuilder,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    if (!this.cookieService.isLoggedIn()) {
      this.router.navigateByUrl('/login');
    }
    else {
      this.userData = this.cookieService.getUserdataFromCookies();
      this.prepareViewForm();
      this.http.getData(API_ENDPOINTS.getDepartments).subscribe(response => {
        if (response) {
          this.departments = response.map(item => new DDLModel(item.name, item._id));
        }
      }, e => {
        this.utils.showErrorMessage(e.error.message);
      });
    }
  }

  // public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
  //   console.log(event, active);
  // }

  // public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
  //   console.log(event, active);
  // }


  prepareViewForm(): void {
    this.viewForm = this.formBuilder.group({
      fromDate: new FormControl(null, [Validators.required]),
      toDate: new FormControl(''),
      deptId: new FormControl('', [Validators.required]),
    });
  }

  fetchDefectList(data: ViewDataModel): void {
    this.defectListModelData = [];
    this.http.postData(API_ENDPOINTS.getDefects, { deptId: data.deptId }).subscribe(response => {
      if (response) {
        this.defects = response.map(item => new DDLModel(item.name, item._id));
        response.forEach(item => {
          this.defectListModelData.push({
            defect: new DDLModel(item.name, item._id),
            amounts: []
          });
        });
        this.fetchData(data);
      }
    }, e => {
      this.utils.showErrorMessage(e.error.message);
    });
  }

  getFormControl(name): any {
    return this.viewForm.get(name);
  }

  fetchDefectData(data: ViewDataModel): void {
    if (this.viewForm.valid) {
      this.deptId = this.viewForm.get('deptId').value;
      this.fetchDefectList(data);
    }
    else {
      this.viewForm.markAllAsTouched();
    }
  }

  fetchData(data: ViewDataModel): void {
    this.solutions = [];
    this.http.getData(API_ENDPOINTS.getSolutions).subscribe(response => {
      if (response) {
        let byDate: any[] = [];
        if (data.toDate) {
          byDate = response.filter(dd =>
            new Date(dd.checkedDetails[0].date) >= new Date(data.fromDate) &&
            new Date(dd.checkedDetails[0].date) <= new Date(data.toDate));
        }
        else {
          byDate = response.filter(dd =>
            new Date(dd.checkedDetails[0].date).toLocaleDateString() ===
            new Date(data.fromDate).toLocaleDateString());
        }
        byDate.forEach(item => {
          const index = this.solutions.findIndex(i => i.defectId === item.defectDetails[0]._id);
          if (index === -1) {
            const s: SolutionModel = new SolutionModel();
            s.amount = item.amount;
            s.defectId = item.defectDetails[0]._id;
            s.defectName = item.defectDetails[0].name;
            s.solution = item.defectDetails[0].solution;
            this.solutions.push(s);
          }
          else {
            this.solutions[index].amount += item.amount;
          }
        });
        this.solutions.sort((a, b) => (a.defectName > b.defectName) ? 1 : ((b.defectName > a.defectName) ? -1 : 0));
        this.plotGraph();
        this.showGrid = true;
      }
    }, e => {
      this.showGrid = false;
      this.utils.showErrorMessage(e.error.message);
    });
  }

  plotGraph(): void {
    const dataList = this.solutions.map(s => s.amount);
    this.barChartData = [
      { data: dataList, label: 'Amount' }
    ];
    this.barChartLabels = this.solutions.map(s => s.defectName);
  }

  goBack(): void {
    this.router.navigateByUrl('dashboard');
  }

  resetViewForm(): void {
    this.viewForm.reset();
    this.solutions = [];
    this.showGrid = false;
    this.viewForm.get('deptId').setValue('');
  }

}
