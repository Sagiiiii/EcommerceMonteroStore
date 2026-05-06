import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'descuento'
})
export class DescuentoPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    //console.log('Value', value);
    //console.log('Args', args);
    let descuento = Math.round(value - (value*args[0])/100); 

    return descuento;
  }

}
