import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Announcement } from 'src/app/shared/models/announcement.model';
import { Pager } from 'src/app/shared/models/pager.model';
import { AnnouncementService } from '../../services/announcement.service';

@Component({
  selector: 'app-announcement',
  styleUrls: ['./announcement-list.component.scss'],
  templateUrl: './announcement-list.component.html',
})
export class AnnouncementListComponent implements OnInit {
  queryAnnouncement: Announcement = new Announcement();
  queryPager: Pager<Announcement> = new Pager();
  announcementList$: Observable<Pager<Announcement>>;
  isLoading: boolean = false;
  error: Error = null;

  constructor(private announcementService: AnnouncementService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.announcementList$ = this.announcementService
      .getAnnouncementList(this.queryAnnouncement, this.queryPager)
      .pipe(
        tap((data) => {
          this.isLoading = false;
          console.log(data);
        })
      );
  }

  updateQueryPagerInfo(pager: Pager<Announcement>) {
    this.queryPager.currentPage = pager.currentPage;
    this.queryPager.totalCount = pager.totalCount;
  }

  reloadData() {
    this.isLoading = true;
    this.announcementList$ = this.announcementService
      .getAnnouncementList(this.queryAnnouncement, this.queryPager)
      .pipe(
        tap((pager) => this.updateQueryPagerInfo(pager)),
        tap(() => {
          this.isLoading = false;
        }),
        catchError(this.handleError.bind(this))
      );
  }

  handleError(err: any, caught: Observable<Pager<Announcement>>) {
    this.isLoading = false;
    // error handling
    this.error = new Error('Something went wrong...');
    return of(null);
  }

  onSizeChange(size: string) {
    this.queryPager.pageSize = +size;
    this.reloadData();
  }

  onPageChange(selectedPage: number) {
    this.queryPager.currentPage = selectedPage;
    this.reloadData();
  }
}
