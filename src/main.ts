import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, 
  {
  providers: [
    provideRouter(routes),
    provideHttpClient() // ✅ <-- Agrega esto
  ]
}
)
  .catch((err) => console.error(err));
