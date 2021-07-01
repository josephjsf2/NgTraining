import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NewsService } from '../../services/news.service';
import { News } from '../../models/news.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  categories: string[];
  category: string;
  newsSubscription: Subscription;
  articles: News[];

  constructor(
    private newsService: NewsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.categories = this.newsService.getCategories();

    // main place to get news data
    this.newsSubscription = this.newsService.getNews().subscribe((data) => {
      if (data.status === 'ok') {
        this.articles = data.articles;
      } else {
        this.articles = [];
      }
    });

    // subscribe to tab change
    this.route.params.subscribe((params: Params) => {
      this.category = params['cat'] ?? 'business';
      this.newsService.changeCategory(this.category);
    });
  }
}
