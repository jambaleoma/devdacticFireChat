import { ChatService } from 'src/app/services/chat.service';
import { NtfService } from './../services/ntf.service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { User } from '../model/User';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.page.html',
  styleUrls: ['./info-modal.page.scss'],
})
export class InfoModalPage implements OnInit {

  currentUser: User = null;
  userToChat: User = null;
  emailText: string;

  constructor(
    private modalCtrl: ModalController,
    private notificationService: NtfService,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.checkUserToChat();
  }

  submitNotification() {
    this.notificationService.addEmailNotification(this.emailText, this.userToChat.email)
      .then((res) => {
        if (res) {
          this.close();
        }
      });
  }

  close() {
    this.modalCtrl.dismiss();
  }

  checkUserToChat() {
    this.chatService.getUsers().subscribe((res) => {
      this.userToChat = res.find((val) => val?.email !== this.chatService.currentUser?.email);
    });
  }

}
