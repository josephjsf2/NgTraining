import { QueryParams } from './../models/query-params.model';
import { HeadlineResponse } from './../models/headline-response.model';
import { CountryOption } from './../models/country-option.model';
import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { delay, map } from 'rxjs/operators'
import { mockNewsData } from '../mock/news.mock';


@Injectable({
  providedIn: 'root'
})
export class NewsService {

  apiUrl = 'https://newsapi.org/v2/top-headlines';

  queryParam: QueryParams = {
    country: 'us',
    category: 'Business',
    pageSize: 100,
    apiKey: ''
  };

  constructor() { }

  /**
   * 取得 News API Observable
   */
  getNewsData(): Observable<HeadlineResponse> {
    return of(mockNewsData).pipe(delay(1000));  // 模擬網路 delay 1s
    // 實際連結
    // `${this.apiUrl}?country=${country}&category=${category}&q=${q}&apiKey=${apiKey}&pageSize=${pageSize}`
  }

  /**
   * 取得類別
   */
  getCategories(): string[] {
    return ['Business', 'Entertainment', 'General', 'Health', 'Science', 'Sports', 'Technology'];
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
      { code: 've', name: 'Venuzuela' }
    ];
  }
}
