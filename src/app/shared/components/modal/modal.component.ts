import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  styleUrls: ['./modal.component.css'],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  @Input() showModal: boolean = false;
  @Input() hasCanel: boolean = false;
  @Output() okClick = new EventEmitter<string>();
  @Output() cancelClick = new EventEmitter<string>();

  onClick() {
    this.okClick.emit('ok');
  }

  onCancel() {
    this.cancelClick.emit('cancel');
  }
}
