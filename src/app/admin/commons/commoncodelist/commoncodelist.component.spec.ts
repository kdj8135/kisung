import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommoncodelistComponent } from './commoncodelist.component';

describe('CommoncodelistComponent', () => {
  let component: CommoncodelistComponent;
  let fixture: ComponentFixture<CommoncodelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommoncodelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommoncodelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
