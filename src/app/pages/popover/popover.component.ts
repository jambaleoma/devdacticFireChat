import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent {

  constructor(
    private router: Router,
    private popoverController: PopoverController
  ) { }

  goToMySettings() {
    this.router.navigateByUrl('/my-settings', { replaceUrl: true });
    this.popoverController.dismiss();
  }

}
