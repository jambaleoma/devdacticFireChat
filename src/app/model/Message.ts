import { Timestamp } from '@angular/fire/firestore/firebase';

export interface Message {
  createdAt: Timestamp;
  id: string;
  from: string;
  msg: string;
  fromName: string;
  myMsg: boolean;
}
