import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDHUComponent } from './add-dhu.component';

describe('AddDHUComponent', () => {
  let component: AddDHUComponent;
  let fixture: ComponentFixture<AddDHUComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDHUComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDHUComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
