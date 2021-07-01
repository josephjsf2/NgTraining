import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { AnnouncementRoutingModule } from './announcement-routing.module';
import { AnnouncementListComponent } from './components/announcement-list/announcement-list.component';
import { AnnouncementDetailComponent } from './components/announcement-detail/announcement-detail.component';
import { ValidDatePipe } from './pipes/validDate.pipe';

@NgModule({
  declarations: [
    AnnouncementListComponent,
    AnnouncementDetailComponent,
    ValidDatePipe,
  ],
  imports: [CommonModule, AnnouncementRoutingModule, SharedModule],
})
export class AnnouncementModule {}
