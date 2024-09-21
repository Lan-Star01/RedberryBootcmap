import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCommaSpaceFormat',
  standalone: true
})
export class CustomCommaSpaceFormatPipe implements PipeTransform {

  transform(value: number): string {
    let numString = value.toLocaleString('en-US'); 
    return numString.replace(/,/g, ', ');
  }

}
