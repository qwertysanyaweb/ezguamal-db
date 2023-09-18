import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnChanges {
  limit: number[] = [10, 20, 30, 40, 50, 100]; // Строк на странице

  pageLimit: number = 10; // Значение по умолчанию

  page: number = 1; // Текущая страница

  @Input() limitCount?: number;

  @Input() iDs?: string;

  @Input() total: number = 0; // Кол-во записей

  @Input() currentPage: number = 1; // Текущая страница

  @Output() currentEvent = new EventEmitter<number>();

  @Output() changeLimit = new EventEmitter<number>();

  @ViewChild(PaginationComponent) paginationComp!: PaginationComponent;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.total) {
      this.pageLimit = 10;
    }
    if (changes.limitCount?.currentValue) {
      if (this.limitCount) {
        this.pageLimit = this.limitCount;
      }
    }
  }

  changePage(event: number) {
    if (event > this.total / this.pageLimit + 1) {
      this.page = Math.floor(this.total / this.pageLimit + 1);
    } else if (event <= 0) {
      this.page = 1;
    } else {
      this.page = event;
    }
    this.currentEvent.emit(this.page);
  }

  changeCount() {
    this.changeLimit.emit(this.pageLimit);
    this.page = 1;
  }
}
