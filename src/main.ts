import 'zone.js';

import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';

import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular';

import {
  provideFirebaseApp,
  initializeApp,
} from '@angular/fire/app';

import {
  provideAuth,
  getAuth,
} from '@angular/fire/auth';

import {
  provideFirestore,
  getFirestore,
} from '@angular/fire/firestore';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';


bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },

    provideIonicAngular(),

    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withComponentInputBinding(),
    ),

    provideFirebaseApp(() =>
      initializeApp(environment.firebase),
    ),

    provideAuth(() =>
      getAuth(),
    ),

    provideFirestore(() =>
      getFirestore(),
    ),
  ],
});
