import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StdprodlistComponent } from './stdprodlist.component';

describe('StdprodlistComponent', () => {
  let component: StdprodlistComponent;
  let fixture: ComponentFixture<StdprodlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StdprodlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StdprodlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
