import { Injectable, inject } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslocoService } from '@jsverse/transloco';

@Injectable()
export class TranslocoMatPaginatorIntl extends MatPaginatorIntl {
  private transloco = inject(TranslocoService);

  constructor() {
    super();

    this.translateLabels();

    this.transloco.selectTranslate('paginator.itemsPerPage').subscribe(() => {
      this.translateLabels();
      this.changes.next();
    });
  }

  private translateLabels(): void {
    this.itemsPerPageLabel = this.transloco.translate('paginator.itemsPerPage');
    this.nextPageLabel = this.transloco.translate('paginator.nextPage');
    this.previousPageLabel = this.transloco.translate('paginator.previousPage');
    this.firstPageLabel = this.transloco.translate('paginator.firstPage');
    this.lastPageLabel = this.transloco.translate('paginator.lastPage');
  }

  override getRangeLabel = (
    page: number,
    pageSize: number,
    length: number,
  ): string => {
    if (length === 0 || pageSize === 0) {
      return this.transloco.translate('paginator.range', {
        start: 0,
        end: 0,
        length,
      });
    }

    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;

    return this.transloco.translate('paginator.range', {
      start: startIndex + 1,
      end: endIndex,
      length,
    });
  };
}