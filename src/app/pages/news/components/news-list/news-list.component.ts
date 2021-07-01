import { Subscription } from 'rxjs';
import { NewsContentService } from './../../services/news-content.service';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { News } from '../../models/news.model';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css'],
})
export class NewsListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() articles: News[] = [];
  currentIndex: number = 0;
  newsSubscription: Subscription;
  newsContentSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private newsContentService: NewsContentService
  ) {}

  ngOnInit() {
    // get news data for the first time
    this.newsService.pageOnload();

    // change content index from outside of this component
    this.newsContentSubscription = this.newsContentService
      .getContent()
      .subscribe((data) => {
        this.currentIndex = data.index;
      });
  }

  ngOnDestroy(): void {
    this.newsSubscription.unsubscribe();
    this.newsContentSubscription.unsubscribe();
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
    this.newsService.changeKeyWords(event.target.value);
  }

  onArticleClick(index: number) {
    this.showContent(index);
  }
}
