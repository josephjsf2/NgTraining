import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnnouncementListComponent } from './components/announcement-list/announcement-list.component';
import { AnnouncementDetailComponent } from './components/announcement-detail/announcement-detail.component';

const routes: Routes = [
  { path: '', component: AnnouncementListComponent },
  { path: ':id', component: AnnouncementDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnnouncementRoutingModule {}
