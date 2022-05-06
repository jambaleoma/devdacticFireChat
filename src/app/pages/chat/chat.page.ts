import { InfoModalPage } from './../../info-modal/info-modal.page';
import { ImageModalPage } from './../../image-modal/image-modal.page';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PushNotifications } from '@capacitor/push-notifications';
import { AlertController, IonContent, LoadingController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Message } from 'src/app/model/Message';
import { User } from 'src/app/model/User';
import { ChatService } from 'src/app/services/chat.service';
import { ImageService } from 'src/app/services/image.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  messages: Observable<Message[]>;
  newMsg = '';
  userToChat: User = null;
  isOnline = false;
  messageLength = 10;
  previousMessageToAdd = 10;
  maxMessageSizeNumber = 500;

  constructor(
    private chatService: ChatService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private imageService: ImageService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.messages = this.chatService.getChatMessages(this.messageLength);
    this.checkNewMessage();
    this.scrollToBottom(1000);
    this.resetBadgeCount();
    this.checkUserToChat();
  }

  sendMessage() {
    this.chatService.addChatMessage(this.newMsg).then(() => {
      this.newMsg = '';
      this.scrollToBottom(1000);
    });
  }

  signOut() {
    this.chatService.signOut().then(() => {
      this.router.navigateByUrl('/', { replaceUrl: true });
    });
  }

  async loadPreviousMessage(event) {
      const msgToGet = this.messageLength + this.previousMessageToAdd;
      if (this.maxMessageSizeNumber > msgToGet) {
        const loading = await this.loadingController.create({
          message: 'Attendi amore mio...',
          duration: 1000,
        });
        await loading.present();
        this.messages = await this.chatService.getChatMessages(this.messageLength + this.previousMessageToAdd, false);
        this.scrollToTop(1);
        this.messageLength = this.messageLength + this.previousMessageToAdd;
        event.target.complete();
      }
  }

  async takePhoto() {
    const photo = await Camera.getPhoto({
      quality: 10,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });

    if (photo) {
      const imageName = uuidv4() + '.' + photo.format;
      const loading = await this.loadingController.create();
      await loading.present();

      const result = await this.imageService.uploadImage(photo, imageName);
      loading.dismiss();
      this.scrollToBottom(500);

      if (!result) {
        const alert = await this.alertController.create({
          header: 'Upload failed',
          message: 'there was a problem uploading your photo.',
          buttons: ['OK']
        });
        await alert.present();
      }
    }
  }

  async documentAttach() {
    const image = await Camera.getPhoto({
      quality: 10,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    });

    if (image) {
      const imageName = uuidv4() + '.' + image.format;
      const loading = await this.loadingController.create();
      await loading.present();

      const result = await this.imageService.uploadImage(image, imageName);
      loading.dismiss();
      this.scrollToBottom(500);

      if (!result) {
        const alert = await this.alertController.create({
          header: 'Upload failed',
          message: 'there was a problem uploading your image.',
          buttons: ['OK']
        });
        await alert.present();
      }
    }
  }

  async emailNotification() {
    const modal = await this.modalCtrl.create({
      component: InfoModalPage,
      cssClass: 'transparent-modal'
    });
    modal.present();
  }

  checkNewMessage() {
    this.chatService.getIsNewMessageArrived().subscribe((val) => {
      if (val) {
        this.scrollToBottom(1000);
      }
    });
  }

  scrollToBottom(timeout: number) {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, timeout);
  }

  scrollToTop(timeout: number) {
    setTimeout(() => {
      this.content.scrollToTop();
    }, timeout);
  }

  resetBadgeCount() {
    PushNotifications.removeAllDeliveredNotifications();
  }

  checkUserToChat() {
    this.chatService.getUsers().subscribe((res) => {
      this.userToChat = res.find((val) => val?.email !== this.chatService.currentUser?.email);
    });
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
