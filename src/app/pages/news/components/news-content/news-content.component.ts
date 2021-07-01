import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { News } from '../../models/news.model';
import { NewsContentService } from './../../services/news-content.service';

@Component({
  selector: 'app-news-content',
  templateUrl: './news-content.component.html',
  styleUrls: ['./news-content.component.css'],
})
export class NewsContentComponent implements OnInit, OnDestroy {
  article: News = { source: {} };
  articleIndex: number;
  totalLength: number;
  newsContentSubscription: Subscription;

  constructor(private newsContentService: NewsContentService) {}

  ngOnInit() {
    this.newsContentSubscription = this.newsContentService
      .getContent()
      .subscribe((data) => {
        this.articleIndex = data.index;
        this.totalLength = data.articles.length;
        this.article = data.articles[this.articleIndex];
      });
  }

  ngOnDestroy() {
    this.newsContentSubscription.unsubscribe();
  }

  onPreviousArticle() {
    this.newsContentService.changeContent(--this.articleIndex);
  }

  onNextArticle() {
    this.newsContentService.changeContent(++this.articleIndex);
  }
}
