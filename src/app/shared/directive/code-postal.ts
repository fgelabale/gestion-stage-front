import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPostalCodeMask]',
  standalone: true,
})
export class PostalCodeMaskDirective {
  private ngControl = inject(NgControl, { optional: true });

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) return;

    let value = event.target.value || '';

    // uppercase + enlever espaces en trop
    let cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);

    // format A1A 1A1
    if (cleaned.length > 3) {
      cleaned = `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    }

    this.ngControl?.control?.setValue(cleaned, { emitEvent: false });
  }
}