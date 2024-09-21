import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customNumberFormat',
  standalone: true
})
export class CustomNumberFormatPipe implements PipeTransform {

  transform(value: number): string {
    let numString = value.toString().split('').reverse().join('');
    let formattedString = numString.replace(/\d{3}(?=\d)/g, '$& ');

    return formattedString.split('').reverse().join('');
  }

}
