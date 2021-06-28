import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status',
})
export class StatusPipe implements PipeTransform {
  transform(value: any) {
    if (!value) {
      return value;
    }
    if (value === 'Y') {
      return '啟用';
    }
    if (value === 'N') {
      return '停用';
    }
    if (value === 'D') {
      return '註銷';
    }
  }
}
