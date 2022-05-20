import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangeModalPage } from './change-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ChangeModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeModalPageRoutingModule {}
