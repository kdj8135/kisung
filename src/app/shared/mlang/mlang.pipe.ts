import { Pipe, PipeTransform } from '@angular/core';
import {MlangService} from "./mlang.service";

@Pipe({
  name: 'mlang',
  pure: false
})
export class MlangPipe implements PipeTransform {

  constructor(public mlangService: MlangService){}

  transform(value: any, LangGrpKey: any, LangKey: any, menuid: any): any {
    return this.mlangService.getTranslation(value, LangGrpKey, LangKey, menuid);
  }

}
