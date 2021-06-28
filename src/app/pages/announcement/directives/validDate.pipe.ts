import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'validDate',
})
export class ValidDatePipe implements PipeTransform {
  static dateFormat: RegExp = /^\d{1,4}\/\d{1,2}\/\d{1,2}/;

  transform(validStartDate: string, validEndDate: string) {
    if (validStartDate && validEndDate) {
      return `${validStartDate} ~ ${validEndDate}`;
    } else {
      return '永久有效';
    }
  }
}
