import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pager } from '../../models/pager.model';
import { MemberAccount } from '../../models/member-account.model';

@Component({
  selector: 'app-pagination',
  styleUrls: ['./pagination.component.css'],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  @Input() pager: Pager<MemberAccount>;
  @Output() pageChange = new EventEmitter<number>();
  @Output() sizeChange = new EventEmitter<string>();

  onSizeSelect(event: any) {
    this.sizeChange.emit(event.target.value);
  }

  onPageChange(selectedPage: number) {
    this.pageChange.emit(selectedPage);
  }
}
