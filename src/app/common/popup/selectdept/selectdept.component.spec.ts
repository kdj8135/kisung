import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectdeptComponent } from './selectdept.component';

describe('SelectdeptComponent', () => {
  let component: SelectdeptComponent;
  let fixture: ComponentFixture<SelectdeptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectdeptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectdeptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
