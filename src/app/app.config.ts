import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { BASE_PATH } from './swagger';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { environment } from '../environments/environment';
import { provideAnimations } from '@angular/platform-browser/animations';
import { version, versionDateString } from './shared/version';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    { provide: BASE_PATH, useValue: environment.apiRoot },
    provideAnimations(),
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'fir-demo-9327e',
        appId: '1:560572989170:web:476a7e61b14503a1c61a6b',
        storageBucket: 'fir-demo-9327e.firebasestorage.app',
        apiKey: 'AIzaSyBj7JNt2Mv68ItGqnQXgK5I0RFvcklzteI',
        authDomain: 'fir-demo-9327e.firebaseapp.com',
        messagingSenderId: '560572989170',
        measurementId: 'G-MP9JS8CWPG',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
  ],
};

console.log(
  `Based on Angular18 Template v${{ version }} [${versionDateString}]`
);
