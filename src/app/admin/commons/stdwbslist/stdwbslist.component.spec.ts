import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StdwbslistComponent } from './stdwbslist.component';

describe('StdwbslistComponent', () => {
  let component: StdwbslistComponent;
  let fixture: ComponentFixture<StdwbslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StdwbslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StdwbslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
