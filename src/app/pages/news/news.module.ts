import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainComponent } from './components/main/main.component';
import { NewsListComponent } from './components/news-list/news-list.component';
import { NewsContentComponent } from './components/news-content/news-content.component';
import { NewsRoutingModule } from './news-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FromNowPipe } from './pipes/fromNow.pipe';

@NgModule({
  declarations: [
    MainComponent,
    NewsListComponent,
    NewsContentComponent,
    FromNowPipe,
  ],
  imports: [CommonModule, NewsRoutingModule, SharedModule],
})
export class NewsModule {}
