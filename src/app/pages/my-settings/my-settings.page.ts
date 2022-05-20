import { ChangeModalPage } from './../../change-modal/change-modal.page';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ChatService } from './../../services/chat.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/User';

@Component({
  selector: 'app-my-settings',
  templateUrl: './my-settings.page.html',
  styleUrls: ['./my-settings.page.scss'],
})
export class MySettingsPage implements OnInit {

  user: User = null;

  constructor(
    private chatService: ChatService,
    private router: Router,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.checkUserToChat();
  }

  checkUserToChat() {
    this.chatService.getUsers().subscribe((res) => {
      this.user = res.find((val) => val?.email === this.chatService.currentUser?.email);
    });
  }

  goBackToChat() {
    this.router.navigateByUrl('/chat', { replaceUrl: true });
  }

  async changeInfo() {
    const modal = await this.modalController.create({
      component: ChangeModalPage,
      cssClass: 'transparent-modal',
      breakpoints: [0, 0.2, 0.5, 1],
      initialBreakpoint: 0.4,
      componentProps: {
        changingParameter: 'info',
        changingParameterData: this.user.info
      }
    });
    modal.present();
  }

  async changeUsername() {
    const modal = await this.modalController.create({
      component: ChangeModalPage,
      cssClass: 'transparent-modal',
      breakpoints: [0, 0.2, 0.5, 1],
      initialBreakpoint: 0.4,
      componentProps: {
        changingParameter: 'username',
        changingParameterData: this.user.username
      }
    });
    modal.present();
  }

}
