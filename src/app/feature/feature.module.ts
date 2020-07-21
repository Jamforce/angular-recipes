import { NgModule } from '@angular/core';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { FeatureRoutingModule } from './feature-routing.module';
import { FeatureComponent } from './feature.component';

@NgModule({
  declarations: [
    FeatureComponent
  ],
  providers: [
    { provide: TRANSLOCO_SCOPE, useValue: 'feature' }
  ],
  imports: [
    FeatureRoutingModule, TranslocoModule
  ]
})
export class FeatureModule { }
