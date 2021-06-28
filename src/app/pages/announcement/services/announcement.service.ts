import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Pager } from 'src/app/shared/models/pager.model';
import { Announcement } from 'src/app/shared/models/announcement.model';
import { RestService } from 'src/app/core/services/rest.service';
import { QueryOption } from 'src/app/shared/models/query-option.model';

@Injectable({ providedIn: 'root' })
export class AnnouncementService {
  static BASE_URL = '/rest/announcement/admin/announcements';
  static ANNOUNCEMENT_LIST_URL = `${AnnouncementService.BASE_URL}/pager`;

  constructor(private restService: RestService) {}

  getAnnouncementList(
    queryAnnouncement: Announcement,
    pager: Pager<Announcement>
  ): Observable<Pager<Announcement>> {
    const queryOption: QueryOption = new QueryOption(queryAnnouncement, pager);

    return this.restService.httpGet<Pager<Announcement>>(
      AnnouncementService.ANNOUNCEMENT_LIST_URL,
      queryOption
    );
  }

  getAnnouncementById(uuid: string): Observable<Announcement> {
    return this.restService.httpGet<Announcement>(
      `${AnnouncementService.BASE_URL}/${uuid}`
    );
  }
}
