import { Timestamp } from '@angular/fire/firestore/firebase';
export interface User {
  uid: string;
  username?: string;
  email: string;
  avatar?: string;
  isOnline?: boolean;
  lastAccess?: Timestamp;
}
