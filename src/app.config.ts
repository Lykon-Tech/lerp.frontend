import { provideHttpClient, withFetch,withInterceptors  } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { tokenInterceptor } from './app/pages/auth/interceptors/auth.interceptor';
import ptBR from 'primelocale/pt-BR.json';
import { AppCommonModule } from './app.common.module';


export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(AppCommonModule),
    provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
    provideHttpClient(
      withFetch(),
      withInterceptors([tokenInterceptor])
    ),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } },
      translation: ptBR['pt-BR']
    })
  ]
};
