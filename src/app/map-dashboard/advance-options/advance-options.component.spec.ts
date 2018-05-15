import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceOptionsComponent } from './advance-options.component';

describe('AdvanceOptionsComponent', () => {
  let component: AdvanceOptionsComponent;
  let fixture: ComponentFixture<AdvanceOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
