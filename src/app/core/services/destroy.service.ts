import { Injectable, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';

// Инжектируем сервис в компоненте
// @Inject(DestroyService) private readonly destroy$: DestroyService
// Передподпиской первый методзапроса().pipe(takeUntil(this.destroy$)).subscribe

@Injectable()
export class DestroyService extends ReplaySubject<void> implements OnDestroy {
  constructor() {
    super(1);
  }

  ngOnDestroy(): void {
    this.next();
    this.complete();
  }
}
