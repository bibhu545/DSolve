import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  routePath: Subject<string> = new Subject<string>();
  routePath$ = this.routePath.asObservable();

  private loading: Subject<boolean> = new Subject<boolean>();
  loading$ = this.loading.asObservable();

  constructor() { }

  setRoutePath(value: string): void {
    this.routePath.next(value);
  }

  setLoding(value: boolean): void {
    this.loading.next(value);
  }
}
