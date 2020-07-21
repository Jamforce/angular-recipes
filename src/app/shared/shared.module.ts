import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthModule } from '../auth/auth.module';
import { MessagesComponent } from './components/messages/messages.component';


@NgModule({
  declarations: [
    MessagesComponent,
  ],
  entryComponents: [],
  imports: [
    AuthModule.forChild(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
