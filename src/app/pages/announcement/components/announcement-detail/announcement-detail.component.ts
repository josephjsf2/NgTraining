import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Announcement } from 'src/app/shared/models/announcement.model';
import { AnnouncementService } from './../../services/announcement.service';

@Component({
  selector: 'app-announcement-detail',
  templateUrl: './announcement-detail.component.html',
  styleUrls: ['./announcement-detail.component.scss'],
})
export class AnnouncementDetailComponent implements OnInit {
  uuid: string;
  detail: Announcement;
  isLoading: boolean = false;
  error: Error;

  constructor(
    private announcementService: AnnouncementService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    //show spinner
    this.isLoading = true;

    this.uuid = this.route.snapshot.params['id'];
    this.announcementService.getAnnouncementById(this.uuid).subscribe(
      (data) => {
        this.detail = data;
        this.isLoading = false;
      },
      (err) => {
        this.error = new Error('Error');
        this.isLoading = false;
      }
    );
  }

  onGoBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
