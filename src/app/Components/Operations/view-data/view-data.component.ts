import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'src/app/Services/cookie.service';
import { HttpService } from 'src/app/Services/http.service';
import { CheckedModel, DDLModel, UserModel, ViewDataModel } from 'src/app/Utils/Models';
import { API_ENDPOINTS, Utils } from 'src/app/Utils/Utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-data',
  templateUrl: './view-data.component.html',
  styleUrls: ['./view-data.component.css']
})
export class ViewDataComponent implements OnInit {

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


  prepareViewForm(): void {
    this.viewForm = this.formBuilder.group({
      fromDate: new FormControl(null, [Validators.required]),
      toDate: new FormControl(''),
      deptId: new FormControl('', [Validators.required]),
    });
  }

  getFormControl(name): any {
    return this.viewForm.get(name);
  }

  getDHUPercentage(): number {
    const td: number = this.totalDefects.reduce((a, b) => a + b, 0);
    const tpc: number = this.dhuList.map(d => d.amount).reduce((a, b) => a + b, 0);
    return Math.ceil((td / tpc) * 100);
  }

  fetchDefectData(data: ViewDataModel): void {
    if (this.viewForm.valid) {
      this.fetchDefectList(data);
    }
    else {
      this.viewForm.markAllAsTouched();
    }
  }

  fetchData(data: ViewDataModel): void {
    this.dateList = [];
    this.checkIdList = [];
    this.dhuList = [];
    this.totalDefects = [];
    this.cumulativeList = [];
    this.auditedPieces = [];
    this.precentageList = [];
    this.totalByDefectList = [];
    data.userId = this.userData.userId;
    const f = Object.assign(data.fromDate, {});
    data.fromDate = new Date(data.fromDate);
    let t: any;
    if (data.toDate) {
      t = Object.assign(data.toDate, {});
      data.toDate = new Date(data.toDate);
      for (const d = Object.assign(data.fromDate, {}); d <= data.toDate; d.setDate(d.getDate() + 1)) {
        this.dateList.push(d.toLocaleDateString());
      }
    }
    else {
      this.dateList.push(data.fromDate.toLocaleDateString());
      t = null;
    }
    data.fromDate = f;
    data.toDate = t;
    this.defectListModelData.forEach(dl => {
      dl.amounts = [];
      this.dateList.forEach(d => {
        dl.amounts.push({ editMode: false, qty: 0 });
      });
    });
    this.showGrid = false;
    this.http.postData(API_ENDPOINTS.getDHUByDate, data).subscribe(response => {
      if (response) {
        this.showGrid = true;
        response.forEach(item => {
          const c: CheckedModel = new CheckedModel();
          c.amount = item.amount;
          c.checkId = item._id;
          c.date = item.date;
          c.dateString = item.dateString;
          c.deptId = item.department;
          c.deptName = this.departments.find(d => d.value === item.department).text;
          c.userId = item.user;
          this.checkIdList.push(item._id);
          this.dhuList.push(c);
        });
        this.getDefectDataByCheckedIds();
      }
    }, e => {
      this.utils.showErrorMessage(e.error.message);
    });


  }

  getDefectDataByCheckedIds(): void {
    const data: any = {
      ids: this.checkIdList
    };
    this.http.postData(API_ENDPOINTS.getDefectDataByCheckedIds, data).subscribe(response => {
      if (response) {
        this.dhuList.forEach(dhu => {
          this.defectListModelData.forEach(dl => {
            const i = response.findIndex(r => r.checked === dhu.checkId && r.defect === dl.defect.value);
            if (i !== -1) {
              const di = this.dateList.findIndex(d => new Date(d).toLocaleDateString() === new Date(dhu.date).toLocaleDateString());
              dl.amounts[di].qty = response[i].amount;
              dl.amounts[di].ddId = response[i]._id;
            }
          });
        });
        this.getOtherLists();
      }
    }, e => {
      this.utils.showErrorMessage(e.error.message);
    });
  }

  getOtherLists(): void {
    this.defectListModelData.forEach((dl, dlIndex) => {
      let totalByDefect = 0;
      dl.amounts.forEach(d => {
        totalByDefect += d.qty;
      });
      this.totalByDefectList.push(totalByDefect);
    });

    this.cumulativeList = this.totalByDefectList.reduce((a, e, i) => {
      return a.length > 0 ? [...a, e + a[i - 1]] : [e];
    }, []);

    this.dateList.forEach((d, i) => {
      let t = 0;
      this.defectListModelData.forEach(dl => {
        t += dl.amounts[i].qty;
      });
      this.totalDefects.push(t);
    });
  }

  resetViewForm(): void {
    this.viewForm.reset();
    this.showGrid = false;
    this.viewForm.get('deptId').setValue('');
    this.dateList = [];
    this.checkIdList = [];
    this.dhuList = [];
    this.totalDefects = [];
    this.cumulativeList = [];
    this.auditedPieces = [];
    this.precentageList = [];
    this.totalByDefectList = [];
  }

  getAuditedPieces(date: string): number {
    const index = this.dhuList.findIndex(dhu => new Date(dhu.date).toLocaleDateString() === new Date(date).toLocaleDateString());
    if (index === -1) {
      return 0;
    }
    else {
      return this.dhuList[index].amount;
    }
  }

  getPercentage(num: number): string {
    if (num && this.cumulativeList.length > 0) {
      return Math.ceil((num / this.cumulativeList[this.cumulativeList.length - 1]) * 100) + '%';
    }
    return 0 + '%';
  }

  goBack(): void {
    this.router.navigateByUrl('dashboard');
  }

  deleteDefectData(item: DefectAmountModel): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.postData(API_ENDPOINTS.deleteDefect, item).subscribe(response => {
          if (response) {
            Swal.fire(
              'Deleted!',
              'Data has been deleted.',
              'success'
            );
          }
        }, e => {
          this.resetViewForm();
          this.utils.showErrorMessage(e.error.message);
        });
      }
    });
  }

  editDefectData(item: DefectAmountModel): void {
    console.log(item);
  }

}

export class DefectListModel {
  defect: DDLModel;
  amounts: DefectAmountModel[];
}

export class DefectAmountModel {
  qty: number;
  editMode = false;
  ddId?: string;
}
