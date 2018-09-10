import { Injectable } from '@angular/core';

@Injectable()
export class GlobalsVariable {
  private glClickMenuId: string = '';

  constructor() { }

  public setClickMenuId(menuid)
  {
    this.glClickMenuId = menuid
  }

  public getClickMenuId()
  {
    return this.glClickMenuId
  }
}
