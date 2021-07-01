import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { NewsService } from './news.service';
import { map, share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NewsContentService {
  contentObservable: Observable<any>;
  dispatch = (value: any) => {};

  constructor(private newsService: NewsService) {
    this.contentObservable = new Observable<any>((observer) => {
      this.dispatch = observer.next.bind(observer);
    }).pipe(share());
  }

  getContent() {
    return this.contentObservable.pipe(
      map((i) => {
        return { articles: this.newsService.getCacheNewsData(), index: i };
      })
    );
  }

  changeContent(index: number) {
    this.dispatch(index);
  }
}
