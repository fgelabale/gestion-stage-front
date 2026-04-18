import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideTransloco, TranslocoLoader } from '@jsverse/transloco';
import { inject, Injectable } from '@angular/core';
import { isDevMode } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslocoMatPaginatorIntl } from './core/services/transloco-paginator-intl/transloco-paginator-intl';

import {
  MsalModule,
  MsalService,
  MsalGuard,
  MsalBroadcastService,
  MsalInterceptor,
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG,
} from '@azure/msal-angular';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import {
  msalInstanceFactory,
  msalGuardConfigFactory,
  msalInterceptorConfigFactory,
} from './core/auth/msal.config';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);

  getTranslation(lang: string) {
    return this.http.get<Record<string, any>>(`/i18n/${lang}.json`);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
        {
      provide: MatPaginatorIntl,
      useClass: TranslocoMatPaginatorIntl,
    },
    provideTransloco({
      config: {
        availableLangs: ['fr', 'en'],
        defaultLang: 'fr',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
  
    }),
    // Ton interceptor actuel + interceptors DI (MSAL)
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withInterceptorsFromDi(),
    ),

    provideAnimations(),
    importProvidersFrom(MsalModule),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: msalInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: msalGuardConfigFactory,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: msalInterceptorConfigFactory,
    },

    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
};