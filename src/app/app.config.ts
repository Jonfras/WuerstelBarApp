import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { ApiModule, BASE_PATH } from './swagger';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { environment } from '../environments/environment';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    importProvidersFrom(ApiModule),
    { provide: BASE_PATH, useValue: environment.apiRoot },
    provideAnimations(),
  ]
};

console.log('Based on Angular18 Template v18.2.0 [2024-09-06]');
