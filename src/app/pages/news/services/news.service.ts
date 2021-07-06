import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  switchMap,
  tap,
  debounceTime,
  delay,
  share,
  shareReplay,
} from 'rxjs/operators';

import { News } from '../models/news.model';
import { mockNewsData } from '../mock/news.mock';
import { QueryParams } from './../models/query-params.model';
import { CountryOption } from './../models/country-option.model';
import { RestService } from 'src/app/core/services/rest.service';
import { HeadlineResponse } from './../models/headline-response.model';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  apiUrl = 'https://newsapi.org/v2/top-headlines';
  queryParam: QueryParams = {
    country: 'us',
    category: 'Business',
    pageSize: 100,
    apiKey: '87766146f8c44bc5abf6e30f19557a39',
    q: '',
  };
  dispatch: (value: any) => void;
  newsObserver: Observable<any>;
  cacheNewsData: News[]; //preserve last responded data
  requestCacheMap: Map<string, Observable<any>> = new Map();

  constructor(private restService: RestService) {
    this.init();
  }

  /**
   * Initialization function
   */
  init() {
    this.newsObserver = new Observable<any>((observer) => {
      this.dispatch = observer.next.bind(observer);
    }).pipe(share());
  }

  /**
   * 取得 News API Observable
   */
  getNewsData(): Observable<HeadlineResponse> {
    // mock data
    // return of(mockNewsData).pipe(delay(1000)); // 模擬網路 delay 1s

    // http request
    return this.restService.httpGet<HeadlineResponse>(
      this.apiUrl,
      this.queryParam,
      false
    );
  }

  /**
   * 取得類別
   */
  getCategories(): string[] {
    return [
      'Business',
      'Entertainment',
      'General',
      'Health',
      'Science',
      'Sports',
      'Technology',
    ];
  }

  /**
   * 取得國家代碼清單
   */
  getCountries(): CountryOption[] {
    return [
      { code: 'ar', name: 'Argentina' },
      { code: 'au', name: 'Australia' },
      { code: 'at', name: 'Austria' },
      { code: 'be', name: 'Belgium' },
      { code: 'br', name: 'Brazil' },
      { code: 'bg', name: 'Bulgaria' },
      { code: 'ca', name: 'Canada' },
      { code: 'cn', name: 'China' },
      { code: 'co', name: 'Colombia' },
      { code: 'cu', name: 'Cuba' },
      { code: 'cz', name: 'Czech Republic' },
      { code: 'eg', name: 'Egypt' },
      { code: 'fr', name: 'France' },
      { code: 'de', name: 'Germany' },
      { code: 'gr', name: 'Greece' },
      { code: 'hk', name: 'Hong Kong' },
      { code: 'hu', name: 'Hungary' },
      { code: 'in', name: 'India' },
      { code: 'id', name: 'Indonesia' },
      { code: 'ie', name: 'Ireland' },
      { code: 'il', name: 'Israel' },
      { code: 'it', name: 'Italy' },
      { code: 'jp', name: 'Japan' },
      { code: 'lv', name: 'Latvia' },
      { code: 'lt', name: 'Lithuania' },
      { code: 'my', name: 'Malaysia' },
      { code: 'mx', name: 'Mexico' },
      { code: 'ma', name: 'Morocco' },
      { code: 'nl', name: 'Netherlands' },
      { code: 'nz', name: 'New Zealand' },
      { code: 'ng', name: 'Nigeria' },
      { code: 'no', name: 'Norway' },
      { code: 'ph', name: 'Philippines' },
      { code: 'pl', name: 'Poland' },
      { code: 'pt', name: 'Portugal' },
      { code: 'ro', name: 'Romania' },
      { code: 'ru', name: 'Russia' },
      { code: 'sa', name: 'Saudi Arabia' },
      { code: 'rs', name: 'Serbia' },
      { code: 'sg', name: 'Singapore' },
      { code: 'sk', name: 'Slovakia' },
      { code: 'si', name: 'Slovenia' },
      { code: 'za', name: 'South Africa' },
      { code: 'kr', name: 'South Korea' },
      { code: 'se', name: 'Sweden' },
      { code: 'ch', name: 'Switzerland' },
      { code: 'tw', name: 'Taiwan' },
      { code: 'th', name: 'Thailand' },
      { code: 'tr', name: 'Turkey' },
      { code: 'ae', name: 'UAE' },
      { code: 'ua', name: 'Ukraine' },
      { code: 'gb', name: 'United Kingdom' },
      { code: 'us', name: 'United States' },
      { code: 've', name: 'Venuzuela' },
    ];
  }

  /**
   * Emit page load event to observerable
   */
  pageOnload() {
    this.dispatch({
      action: 'PAGE_ONLOAD',
      payload: { country: this.getCountry() },
    });
  }

  /**
   * Emit country code change event
   * @param countryCode 國家代碼
   */
  changeCountry(countryCode: string = 'tw') {
    this.saveCountry(countryCode);
    this.dispatch({
      action: 'UPDATE_COUNTRY',
      payload: { country: countryCode },
    });
  }

  /**
   * Emit category change event
   * @param category
   */
  changeCategory(category: string = 'business') {
    this.dispatch({ action: 'UPDATE_CATEGORY', payload: { category } });
  }

  changeKeyWords(keywords: string) {
    this.dispatch({ action: 'UPDATE_KEYWORDS', payload: { q: keywords } });
  }

  /**
   * Save country code to browser
   * @param country Country Code
   */
  saveCountry(country: string): void {
    localStorage.setItem('newsCountry', country);
  }

  /**
   * Get previous country code from browser
   * @returns Country Code
   */
  getCountry(): string {
    return localStorage.getItem('newsCountry') ?? 'tw';
  }

  /**
   * Get main observable
   */
  getNews(): Observable<HeadlineResponse> {
    return this.newsObserver.pipe(
      tap((dispatchData) => {
        console.log(dispatchData);
        this.queryParam = { ...this.queryParam, ...dispatchData.payload };
      }),
      switchMap(this.tryGetNewsWithCache.bind(this)),
      tap({
        next: (data) => {
          this.cacheNewsData = data.articles;
        },
      })
    );
  }

  tryGetNewsWithCache() {
    const { category, country, q } = this.queryParam;
    const cacheKey = (category + country + q).trim();

    if (!this.requestCacheMap.get(cacheKey)) {
      this.requestCacheMap.set(
        cacheKey,
        this.getNewsData().pipe(shareReplay(1))
      );

      // clear cache after 1 min
      setTimeout(() => {
        this.requestCacheMap.delete(cacheKey);
      }, 60000);

      return this.requestCacheMap.get(cacheKey);
    }
    return this.requestCacheMap.get(cacheKey);
  }

  getCacheNewsData(): News[] {
    return this.cacheNewsData;
  }
}
