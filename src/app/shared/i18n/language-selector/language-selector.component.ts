import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { pmsConfig } from '../../pms.config';
import {I18nService} from "../i18n.service";

@Component({
  selector: 'sa-language-selector',
  templateUrl: './language-selector.component.html',
})
export class LanguageSelectorComponent implements OnInit {

  public languages: Array<any>;
  public currentLanguage: any;

  @Output() loginLanguage = new EventEmitter<any>();
    setLoginLanguage(language){
    this.loginLanguage.emit({language});
  }

  constructor(private i18n: I18nService) {
  }

  ngOnInit() {
    this.languages = pmsConfig.languages;
    this.currentLanguage = this.i18n.currentLanguage;
  }

  setLanguage(language){
    this.currentLanguage = language;
    this.i18n.setLanguage(language);
    this.setLoginLanguage(language)
  }

}
