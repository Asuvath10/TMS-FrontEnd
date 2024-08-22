import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PLCRUDComponent } from './plcrud.component';

describe('PLCRUDComponent', () => {
  let component: PLCRUDComponent;
  let fixture: ComponentFixture<PLCRUDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PLCRUDComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PLCRUDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
