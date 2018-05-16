import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryMapComponent } from './country-map.component';

describe('CountryMapComponent', () => {
  let component: CountryMapComponent;
  let fixture: ComponentFixture<CountryMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
