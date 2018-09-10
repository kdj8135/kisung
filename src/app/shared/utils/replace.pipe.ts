import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'replace'
})

export class ReplacePipe implements PipeTransform {
    transform(value: string, expr: any, arg2: string): any {
        if (!value)
            return value;

        return value.replace(new RegExp(expr, 'gi'), arg2);
    }
}
