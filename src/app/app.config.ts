import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { version, versionDateString } from './shared/version';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment.development';
import { BASE_PATH } from './swagger';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

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
        projectId: 'votingapp-429914',
        appId: '1:438975125499:web:aae0471e1b5a9b150edd5e',
        storageBucket: 'votingapp-429914.firebasestorage.app',
        apiKey: 'AIzaSyAjiX-S5SjkU0vWfMbx-LFsxWcxj2agmNY',
        authDomain: 'votingapp-429914.firebaseapp.com',
        messagingSenderId: '438975125499',
        measurementId: 'G-RC66Z5LEBL',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({"projectId":"votingapp-429914","appId":"1:438975125499:web:aae0471e1b5a9b150edd5e","storageBucket":"votingapp-429914.firebasestorage.app","apiKey":"AIzaSyAjiX-S5SjkU0vWfMbx-LFsxWcxj2agmNY","authDomain":"votingapp-429914.firebaseapp.com","messagingSenderId":"438975125499","measurementId":"G-RC66Z5LEBL"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({"projectId":"votingapp-429914","appId":"1:438975125499:web:aae0471e1b5a9b150edd5e","storageBucket":"votingapp-429914.firebasestorage.app","apiKey":"AIzaSyAjiX-S5SjkU0vWfMbx-LFsxWcxj2agmNY","authDomain":"votingapp-429914.firebaseapp.com","messagingSenderId":"438975125499","measurementId":"G-RC66Z5LEBL"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),
  ],
};

console.log(`Based on Angular19 Template v${version} [${versionDateString}]`);
