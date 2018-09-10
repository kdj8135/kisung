import { Pipe, PipeTransform } from '@angular/core';
import {DisplayitemService} from "./displayitem.service";

@Pipe({ name: 'display', pure:false })
export class DisplayitemPipe implements PipeTransform {
  constructor(public displayitemService: DisplayitemService){}

  transform(value: string, menuid: string): string {
    return this.displayitemService.getDisplay(value, menuid);
  }
}
