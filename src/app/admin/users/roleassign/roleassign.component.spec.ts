import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleassignComponent } from './roleassign.component';

describe('RoleassignComponent', () => {
  let component: RoleassignComponent;
  let fixture: ComponentFixture<RoleassignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleassignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleassignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
