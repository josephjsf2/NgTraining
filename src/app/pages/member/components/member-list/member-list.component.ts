import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { MemberService } from '../../services/member.service';
import { Pager } from 'src/app/shared/models/pager.model';
import { MemberAccount } from 'src/app/shared/models/member-account.model';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  // 查詢條件model
  queryMember: MemberAccount = new MemberAccount();
  // 分頁model
  queryPager: Pager<MemberAccount> = new Pager();

  memberList$: Observable<Pager<MemberAccount>>;

  isLoading: boolean = false;

  error: Error = null;

  constructor(private memberService: MemberService) {}

  ngOnInit() {
    this.queryPager.pageSize = 10;

    this.reloadData();
  }

  onPageChange(selectedPage: number) {
    this.queryPager.currentPage = selectedPage;
    this.reloadData();
  }

  onSizeSelect(size: string) {
    this.queryPager.pageSize = +size;
    this.queryPager.currentPage = 1; // return to page 1 if page size changed

    this.reloadData();
  }

  getStatus(status: string) {
    switch (status) {
      case 'Y':
        return '啟用';
      case 'N':
        return '停用';
      case 'D':
        return '註銷';
      default:
        return '狀態未定';
    }
  }

  reloadData() {
    this.isLoading = true;
    this.memberList$ = this.memberService
      .getMemberList(this.queryMember, this.queryPager)
      .pipe(
        tap((pager) => this.updateQueryPagerInfo(pager)),
        tap(() => {
          this.isLoading = false;
        }),
        catchError(this.handleError.bind(this))
      );
  }

  updateQueryPagerInfo(pager: Pager<MemberAccount>) {
    this.queryPager.currentPage = pager.currentPage;
    this.queryPager.totalCount = pager.totalCount;
  }

  handleError(err: any, caught: Observable<Pager<MemberAccount>>) {
    this.isLoading = false;
    // error handling
    this.error = new Error('Something went wrong...');
    return of(null);
  }
}
