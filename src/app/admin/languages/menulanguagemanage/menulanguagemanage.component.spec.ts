import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenulanguagemanageComponent } from './menulanguagemanage.component';

describe('MenulanguagemanageComponent', () => {
  let component: MenulanguagemanageComponent;
  let fixture: ComponentFixture<MenulanguagemanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenulanguagemanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenulanguagemanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
