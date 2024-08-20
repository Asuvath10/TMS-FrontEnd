import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PLListComponent } from './pllist.component';

describe('PLListComponent', () => {
  let component: PLListComponent;
  let fixture: ComponentFixture<PLListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PLListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PLListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
