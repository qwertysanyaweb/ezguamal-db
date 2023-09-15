import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[spinner]',
})
export class SpinnerDirective {

  constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef) {
    const el = this.elementRef.nativeElement;
    const parent = el.parentNode;

    const div = this.renderer.createElement('div');
    this.renderer.setAttribute(div, 'class', 'spinner-container');

    this.renderer.insertBefore(parent, div, el);
    this.renderer.appendChild(div, el);

    const spinner = this.renderer.createElement('div');
    this.renderer.setAttribute(spinner, 'class', 'spinner-load');

    const val1 = this.renderer.createElement('div');
    const val2 = this.renderer.createElement('div');
    const val3 = this.renderer.createElement('div');
    const val4 = this.renderer.createElement('div');

    this.renderer.appendChild(spinner, val1);
    this.renderer.appendChild(spinner, val2);
    this.renderer.appendChild(spinner, val3);
    this.renderer.appendChild(spinner, val4);

    this.renderer.appendChild(div, spinner);
  }

  @Input('spinner') set value(condition: boolean) {

    const el = this.elementRef.nativeElement;
    const parent = el.parentNode;

    if (condition) {
      this.renderer.setAttribute(parent, 'class', 'spinner-container spinner-container-load');
    } else {
      this.renderer.setAttribute(parent, 'class', 'spinner-container');
    }
  }


}
