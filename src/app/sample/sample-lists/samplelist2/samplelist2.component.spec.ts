import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Samplelist2Component } from './samplelist2.component';

describe('Samplelist2Component', () => {
  let component: Samplelist2Component;
  let fixture: ComponentFixture<Samplelist2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Samplelist2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Samplelist2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
