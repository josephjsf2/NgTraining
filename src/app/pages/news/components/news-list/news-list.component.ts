import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { NewsContentService } from './../../services/news-content.service';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { News } from '../../models/news.model';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css'],
})
export class NewsListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() articles: News[] = [];
  @ViewChild('searchInput') searchInput: any;
  currentIndex: number = 0;
  newsContentSubscription: Subscription;
  searchInputSubject = new Subject<any>();

  constructor(
    private newsService: NewsService,
    private newsContentService: NewsContentService
  ) {}

  ngOnInit() {
    // get news data for the first time
    this.newsService.pageOnload();

    // subscribe to index change of news content
    this.newsContentSubscription = this.newsContentService
      .getContent()
      .subscribe((data) => {
        this.currentIndex = data.index;
      });

    // subscribe to text changes
    const searchInputSubscription = this.searchInputSubject
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe({
        next: (text) => this.newsService.changeKeyWords(text),
      });

    // teardown all subsriptions
    this.newsContentSubscription.add(searchInputSubscription);
  }

  ngOnDestroy(): void {
    this.newsContentSubscription
      ? this.newsContentSubscription.unsubscribe()
      : null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.articles) {
      this.showContent(0);
    }
  }

  showContent(index: number) {
    this.currentIndex = index;
    this.newsContentService.changeContent(index);
  }

  onInputText(event: any) {
    this.searchInputSubject.next(event.target.value);
    // this.newsService.changeKeyWords(event.target.value);
  }

  onArticleClick(index: number) {
    this.showContent(index);
  }
}
