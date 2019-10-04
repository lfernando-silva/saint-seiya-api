import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule, MatProgressSpinnerModule } from '@angular/material';

import {
  CharacterComponent,
  FooterComponent,
  HeaderComponent,
  MenuItemsComponent,
  SpinnerComponent,
  ZodiacWheelComponent,
} from './';

@NgModule({
  declarations: [
    CharacterComponent,
    FooterComponent,
    HeaderComponent,
    MenuItemsComponent,
    SpinnerComponent,
    ZodiacWheelComponent,
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  exports: [
    CharacterComponent,
    FooterComponent,
    HeaderComponent,
    SpinnerComponent,
  ]
})
export class SharedModule { }