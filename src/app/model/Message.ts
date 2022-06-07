import { Timestamp } from '@angular/fire/firestore/firebase';

export interface Message {
  createdAt?: Timestamp;
  id?: string;
  from?: string;
  msg?: string;
  fromName?: string;
  myMsg?: boolean;
  base64String?: string;
  image?: boolean;
  reaction?: string;
  replyAuthor?: string;
  replyText?: string;
}
