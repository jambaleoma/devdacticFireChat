import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserChatSettingsPage } from './user-chat-settings.page';

const routes: Routes = [
  {
    path: '',
    component: UserChatSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserChatSettingsPageRoutingModule {}
