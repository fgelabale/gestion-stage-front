import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStore } from './core/services/auth-api/auth.store';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent implements OnInit {
  private readonly authStore = inject(AuthStore);

  private transloco = inject(TranslocoService);

  constructor() {
    const savedLang = localStorage.getItem('lang');
    if (savedLang === 'fr' || savedLang === 'en') {
      this.transloco.setActiveLang(savedLang);
    }
  }

  ngOnInit(): void {
    this.authStore.chargerUtilisateur();
  }
}