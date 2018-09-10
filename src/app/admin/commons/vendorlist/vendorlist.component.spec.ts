import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorlistComponent } from './vendorlist.component';

describe('VendorlistComponent', () => {
  let component: VendorlistComponent;
  let fixture: ComponentFixture<VendorlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
