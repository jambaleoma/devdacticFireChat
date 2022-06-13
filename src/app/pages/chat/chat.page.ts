import { InfoModalPage } from './../../info-modal/info-modal.page';
import { ImageModalPage } from './../../image-modal/image-modal.page';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
import { PushNotifications } from '@capacitor/push-notifications';
import {
  AlertController,
  GestureController,
  IonContent,
  IonTextarea,
  LoadingController,
  ModalController,
  PickerController,
  ToastController,
} from '@ionic/angular';
import { Observable } from 'rxjs';
import { Message } from 'src/app/model/Message';
import { User } from 'src/app/model/User';
import { ChatService } from 'src/app/services/chat.service';
import { ImageService } from 'src/app/services/image.service';
import { RecordService } from './../../services/record.service';
import { v4 as uuidv4 } from 'uuid';
import reactionButtons from './../../../assets/JSON/reactionsButtons.json';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, AfterViewInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('newMsgInput') newMsgInput: IonTextarea;
  @ViewChild('messagesList') list;
  @ViewChild('recordbtn', { read: ElementRef }) recordbtn: ElementRef;

  public messages: Observable<Message[]>;
  public newMsg = '';
  public userToChat: User = null;
  public isOnline = false;
  public messageLength = 10;
  public previousMessageToAdd = 10;
  public maxMessageSizeNumber = 500;
  public replyMessageValue = false;
  public replyMessageAuthor = '';
  public replyMessageMsg = '';
  public reactionButtons = reactionButtons.reactionButtons;
  public recording = false;
  public durationDisplay = '';
  public duration = 0;

  constructor(
    private chatService: ChatService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private imageService: ImageService,
    private modalCtrl: ModalController,
    private pickerController: PickerController,
    private toastController: ToastController,
    private recordService: RecordService,
    private gestureCtrl: GestureController
  ) {}

  ngAfterViewInit(): void {
    const longpress = this.gestureCtrl.create(
      {
        el: this.recordbtn.nativeElement,
        threshold: 0,
        gestureName: 'long-press',
        onStart: (ev) => {
          Haptics.impact({ style: ImpactStyle.Light });
          this.startRecording();
        },
        onEnd: (ev) => {
          Haptics.impact({ style: ImpactStyle.Light });
          this.stopRecording();
        },
      },
      true
    );
    longpress.enable();
  }

  ngOnInit() {
    this.messages = this.chatService.getChatMessages(this.messageLength);
    this.checkNewMessage();
    this.scrollToBottom(1000);
    this.resetBadgeCount();
    this.checkUserToChat();
    VoiceRecorder.requestAudioRecordingPermission();
  }

  sendMessage() {
    if (this.replyMessageValue) {
      this.chatService
        .addChatMessageReply(
          this.newMsg,
          this.replyMessageAuthor,
          this.replyMessageMsg
        )
        .then(() => {
          this.newMsg = '';
          this.scrollToBottom(1000);
          this.toastController.dismiss();
        });
    } else {
      this.chatService.addChatMessage(this.newMsg).then(() => {
        this.newMsg = '';
        this.scrollToBottom(1000);
      });
    }
    this.replyMessageValue = false;
  }

  signOut() {
    this.chatService.signOut().then(() => {
      this.router.navigateByUrl('/', { replaceUrl: true });
    });
  }

  goToUserChatSettings() {
    this.router.navigateByUrl('/user-chat-settings', { replaceUrl: true });
  }

  async loadPreviousMessage(event) {
    const msgToGet = this.messageLength + this.previousMessageToAdd;
    if (this.maxMessageSizeNumber > msgToGet) {
      const loading = await this.loadingController.create({
        message: 'Attendi amore mio...',
        duration: 1000,
      });
      await loading.present();
      this.messages = await this.chatService.getChatMessages(
        this.messageLength + this.previousMessageToAdd,
        false
      );
      this.scrollToTop(1);
      this.messageLength = this.messageLength + this.previousMessageToAdd;
      event.target.complete();
    }
  }

  async takePhoto() {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
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
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }

  async documentAttach() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
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
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }

  async emailNotification() {
    const modal = await this.modalCtrl.create({
      component: InfoModalPage,
      cssClass: 'transparent-modal',
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
      this.userToChat = res.find(
        (val) => val?.email !== this.chatService.currentUser?.email
      );
    });
  }

  async openPreview(base64String) {
    const modal = await this.modalCtrl.create({
      component: ImageModalPage,
      componentProps: {
        base64String,
      },
      cssClass: 'transparent-modal',
    });
    modal.present();
  }

  async openEmoji(messageToReply: Message) {
    const picker = await this.pickerController.create({
      buttons: [
        {
          text: 'Elimina',
          handler: () => {
            this.chatService.updateMessageReaction(messageToReply.id, null);
            this.list.closeSlidingItems();
          },
        },
        {
          text: 'Conferma',
          handler: (selected) => {
            this.chatService.updateMessageReaction(
              messageToReply.id,
              selected.reaction.value
            );
            this.list.closeSlidingItems();
          },
        },
      ],
      columns: [
        {
          name: 'reaction',
          options: reactionButtons?.reactionButtons,
        },
      ],
    });
    await picker.present();
  }

  async replyMessage(messageToReply: Message) {
    this.setReplyMessage(true, messageToReply.fromName, messageToReply.msg);
    const toast = await this.toastController.create({
      header: messageToReply.fromName,
      message: messageToReply.msg,
      icon: 'arrow-undo-outline',
      position: 'top',
      buttons: [
        {
          icon: 'close-circle-outline',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    this.list.closeSlidingItems();
    this.newMsgInput.setFocus();
    await toast.present();

    const { role } = await toast.onDidDismiss();
    this.setReplyMessage(false, null, null);
  }

  setReplyMessage(value: boolean, author: string, msg: string) {
    this.replyMessageValue = value;
    this.replyMessageAuthor = author;
    this.replyMessageMsg = msg;
  }

  startRecording() {
    if (this.recording) {
      return;
    }
    this.recording = true;
    VoiceRecorder.startRecording();
    this.calculateDuration();
  }

  stopRecording() {
    if (!this.recording) {
      return;
    }
    VoiceRecorder.stopRecording().then(async (recordResult: RecordingData) => {
      this.recording = false;
      if (recordResult.value && recordResult.value.recordDataBase64) {
        console.log(recordResult.value.recordDataBase64);
        //TODO: implement logic to save record data in firebase
        if (recordResult) {
          const fileName = new Date().getTime() + '.wav';
          const loading = await this.loadingController.create();
          await loading.present();

          const result = await this.recordService.uploadRecord(
            recordResult,
            fileName
          );
          loading.dismiss();
          this.scrollToBottom(500);

          if (!result) {
            const alert = await this.alertController.create({
              header: 'Upload failed',
              message: 'there was a problem uploading your record.',
              buttons: ['OK'],
            });
            await alert.present();
          }
        }
      }
    });
  }

  async playRecord(base64Record) {
    const audioRef = new Audio(`data:audio/aac;base64,${base64Record}`);
    audioRef.oncanplaythrough = () => audioRef.play();
    audioRef.play();
    const alert = await this.alertController.create({
      header: 'Messaggio audio',
      message: `<img src="./../../../assets/image/gif/sound.gif" alt="sound">`,
    });
    await alert.present();
    alert.onDidDismiss().then(() => {
      audioRef.pause();
    });
    audioRef.onended = () => {
      alert.dismiss();
    };
  }

  calculateDuration() {
    if (!this.recording) {
      this.duration = 0;
      this.durationDisplay = '';
      return;
    }

    this.duration += 1;
    const minutes = Math.floor(this.duration / 60);
    const seconds = (this.duration % 60).toString().padStart(2, '0');
    this.durationDisplay = `${minutes}:${seconds}`;

    setTimeout(() => {
      this.calculateDuration();
    }, 1000);
  }
}
