import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PLRequestListComponent } from './plrequest-list.component';

describe('PLRequestListComponent', () => {
  let component: PLRequestListComponent;
  let fixture: ComponentFixture<PLRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PLRequestListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PLRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
