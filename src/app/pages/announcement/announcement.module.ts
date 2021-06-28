import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidDatePipe } from './directives/validDate.pipe';
import { SharedModule } from 'src/app/shared/shared.module';
import { AnnouncementRoutingModule } from './announcement-routing.module';
import { AnnouncementListComponent } from './components/announcement-list/announcement-list.component';
import { AnnouncementDetailComponent } from './components/announcement-detail/announcement-detail.component';

@NgModule({
  declarations: [
    AnnouncementListComponent,
    AnnouncementDetailComponent,
    ValidDatePipe,
  ],
  imports: [CommonModule, AnnouncementRoutingModule, SharedModule],
})
export class AnnouncementModule {}
