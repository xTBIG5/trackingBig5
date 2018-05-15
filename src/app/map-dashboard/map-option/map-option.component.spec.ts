import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapOptionComponent } from './map-option.component';

describe('MapOptionComponent', () => {
  let component: MapOptionComponent;
  let fixture: ComponentFixture<MapOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
