import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommoncodelistSubRegComponent } from './commoncodelist-sub-reg.component';

describe('CommoncodelistSubRegComponent', () => {
  let component: CommoncodelistSubRegComponent;
  let fixture: ComponentFixture<CommoncodelistSubRegComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommoncodelistSubRegComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommoncodelistSubRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
