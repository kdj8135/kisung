import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguagemanageComponent } from './languagemanage.component';

describe('LanguagemanageComponent', () => {
  let component: LanguagemanageComponent;
  let fixture: ComponentFixture<LanguagemanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguagemanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguagemanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
