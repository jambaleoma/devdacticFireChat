import { Timestamp } from '@angular/fire/firestore/firebase';

export interface Message {
  createdAt: Timestamp;
  id: string;
  from: string;
  to: string;
  text: string;
  fromName: string;
}
