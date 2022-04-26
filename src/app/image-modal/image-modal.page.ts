import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { Pagination, SwiperOptions } from 'swiper';
import SwiperCore, { Zoom } from 'swiper';
SwiperCore.use([Zoom])

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})
export class ImageModalPage implements OnInit {

  @Input() base64String: string;
  config: SwiperOptions = {
    zoom: true
  };

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  async zoom(zoomIn: boolean) {
    // const slider = await this.slides.getSwiper();
    // const zoom = slider.zoom;
    // zoomIn ? zoom.in() : zoom.out();
  }
 
  close() {
    this.modalCtrl.dismiss();
  }

}
