import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { headersInterceptor } from './core/interceptors/headers.interceptor';
import { SnackbarService } from './core/services/mat-snackbar.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([headersInterceptor])),
    provideAnimationsAsync(),
    SnackbarService,
  ],
};
