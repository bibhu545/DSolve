import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefectSolutionsComponent } from './defect-solutions.component';

describe('DefectSolutionsComponent', () => {
  let component: DefectSolutionsComponent;
  let fixture: ComponentFixture<DefectSolutionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefectSolutionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectSolutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
