import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { NewsService } from 'src/app/pages/news/services/news.service';
import { MemberAccount } from 'src/app/shared/models/member-account.model';
import { CountryOption } from 'src/app/pages/news/models/country-option.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  profile: MemberAccount;
  countries: CountryOption[];
  countryCode: string;

  constructor(
    private newsService: NewsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.profile = this.authService.userProfile;
    this.countries = this.newsService.getCountries();

    // get previous saved country from localstorage
    this.countryCode = this.newsService.getCountry();
  }

  onLogout() {
    this.authService.userLogout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  onCountrySelected(event: any) {
    this.newsService.changeCountry(event.target.value);
  }
}
