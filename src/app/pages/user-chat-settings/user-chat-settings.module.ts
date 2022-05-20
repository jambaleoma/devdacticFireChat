import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserChatSettingsPageRoutingModule } from './user-chat-settings-routing.module';

import { UserChatSettingsPage } from './user-chat-settings.page';
import { PopoverComponent } from '../popover/popover.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserChatSettingsPageRoutingModule,
  ],
  declarations: [UserChatSettingsPage, PopoverComponent]
})
export class UserChatSettingsPageModule {}
