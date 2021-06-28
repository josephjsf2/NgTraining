import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { PaginationComponent } from './components/pagination/paginaton.component';
import { ModalComponent } from './components/modal/modal.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { TruncatePipe } from './pipes/shorten.pipe';
import { StatusPipe } from './pipes/status.pipe';

@NgModule({
  declarations: [
    PaginationComponent,
    ModalComponent,
    SpinnerComponent,
    TruncatePipe,
    StatusPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule,
    PaginationComponent,
    ModalComponent,
    SpinnerComponent,
    TruncatePipe,
    StatusPipe,
  ],
})
export class SharedModule {}
