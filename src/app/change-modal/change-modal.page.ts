import { ChatService } from 'src/app/services/chat.service';
import { NavParams, ModalController } from '@ionic/angular';
import { Component } from '@angular/core';

@Component({
  selector: 'app-change-modal',
  templateUrl: './change-modal.page.html',
  styleUrls: ['./change-modal.page.scss'],
})
export class ChangeModalPage {

  public changingParameter: string;
  public changingParameterData: string;
  public parameter: any;

  constructor(
    private navParams: NavParams,
    private chatService: ChatService,
    private modalController: ModalController
  ) {
    this.changingParameter = this.navParams.get('changingParameter');
    this.changingParameterData = this.navParams.get('changingParameterData');
  }

  async saveChanges() {
    await this.chatService.updateUserData(this.changingParameter, this.parameter);
    this.modalController.dismiss();
  }

}
