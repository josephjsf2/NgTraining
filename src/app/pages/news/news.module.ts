import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';
import { NewsListComponent } from './components/news-list/news-list.component';
import { NewsContentComponent } from './components/news-content/news-content.component';

@NgModule({
  declarations: [
    MainComponent,
    NewsListComponent,
    NewsContentComponent
  ],
  imports: [
    CommonModule
  ]
})
export class NewsModule { }
