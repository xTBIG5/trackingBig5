import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapInforComponent } from './map-infor.component';

describe('MapInforComponent', () => {
  let component: MapInforComponent;
  let fixture: ComponentFixture<MapInforComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapInforComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapInforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
