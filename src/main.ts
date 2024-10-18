import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { QuoterComponent } from './app/quoter/quoter.component';

bootstrapApplication(QuoterComponent, appConfig)
  .catch((err) => console.error(err));
