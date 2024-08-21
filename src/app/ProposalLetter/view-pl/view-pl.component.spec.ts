import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPLComponent } from './view-pl.component';

describe('ViewPLComponent', () => {
  let component: ViewPLComponent;
  let fixture: ComponentFixture<ViewPLComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPLComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
