import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangeModalPageRoutingModule } from './change-modal-routing.module';

import { ChangeModalPage } from './change-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangeModalPageRoutingModule
  ],
  declarations: [ChangeModalPage]
})
export class ChangeModalPageModule {}
