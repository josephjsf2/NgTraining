import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fromNow',
})
export class FromNowPipe implements PipeTransform {
  transform(publishAt: any) {
    if (!publishAt) {
      return '';
    }

    const publishTime = new Date(publishAt).getTime();
    const now = new Date().getTime(); // currnet time in milliseconds
    const diffSecs = Math.round((now - publishTime) / 1000);
    if (diffSecs < 1) {
      return '就在剛剛';
    }
    if (diffSecs < 60) {
      return `${diffSecs} 秒前`;
    }
    if (diffSecs < 60 * 60) {
      return `${Math.round(diffSecs / 60)} 分鐘前`;
    }
    if (diffSecs < 60 * 60 * 24) {
      return `${Math.round(diffSecs / (60 * 60))} 小時前`;
    }
    return `${Math.round(diffSecs / (60 * 60 * 24))} 天前`;
  }
}
