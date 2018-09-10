import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommoncodelistMainRegComponent } from './commoncodelist-main-reg.component';

describe('CommoncodelistMainRegComponent', () => {
  let component: CommoncodelistMainRegComponent;
  let fixture: ComponentFixture<CommoncodelistMainRegComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommoncodelistMainRegComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommoncodelistMainRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
