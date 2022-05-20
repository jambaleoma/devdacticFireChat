import { ImageModalPage } from './../../image-modal/image-modal.page';
import { ImageService } from 'src/app/services/image.service';
import { PopoverComponent } from './../popover/popover.component';
import { Router } from '@angular/router';

import { ChatService } from './../../services/chat.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/User';
import { PopoverController, ModalController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-user-chat-settings',
  templateUrl: './user-chat-settings.page.html',
  styleUrls: ['./user-chat-settings.page.scss'],
})
export class UserChatSettingsPage implements OnInit {
  userToChat: User = null;
  currentPopover = null;
  imageListUrlSend: string[] = [];
  imageListUrlReceived: string[] = [];

  constructor(
    private chatService: ChatService,
    private router: Router,
    private popoverController: PopoverController,
    private imageService: ImageService,
    private modalCtrl: ModalController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.checkUserToChat();
    this.getImageList();
  }

  checkUserToChat() {
    this.chatService.getUsers().subscribe((res) => {
      this.userToChat = res.find((val) => val?.email !== this.chatService.currentUser?.email);
    });
  }

  goBackToChat() {
    this.router.navigateByUrl('/chat', { replaceUrl: true });
  }

  async handleButtonClick(ev) {
    let popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true,
    });
    this.currentPopover = popover;
    return popover.present();
  }

  async getImageList() {
    const loadingMediaSend = await this.loadingController.create({
      message: 'Recupero Media Inviati'
    });
    await loadingMediaSend.present();
    this.imageListUrlSend = [];
    this.imageListUrlSend = await this.imageService.getImagesListSend();
    loadingMediaSend.dismiss();
    const loadingMediaReceived = await this.loadingController.create({
      message: 'Recupero Media Ricevuti'
    });
    await loadingMediaReceived.present();
    this.imageListUrlReceived = [];
    this.imageListUrlReceived = await this.imageService.getImagesListReceived(this.userToChat);
    loadingMediaReceived.dismiss();
  }

  async openPreview(base64String) {
    const modal = await this.modalCtrl.create({
      component: ImageModalPage,
      componentProps: {
        base64String
      },
      cssClass: 'transparent-modal'
    });
    modal.present();
  }

}
