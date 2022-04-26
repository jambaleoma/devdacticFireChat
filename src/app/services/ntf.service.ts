import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, serverTimestamp} from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class NtfService {
  currentUser: User = null;
  isTestDevelopedActive: boolean = environment.isTestDevelopedActive;

  constructor(
    private afAuth: Auth,
    private firestore: Firestore
  ) {
    this.afAuth.onAuthStateChanged(user => {
      this.currentUser = user;
    });
  }

  addEmailNotification(text: string, emailToNotificate: string) {
    const emailNotificationDocRef = collection(this.firestore, !this.isTestDevelopedActive ? 'emailNotification' : 'emailNotificationTest');
    return addDoc(emailNotificationDocRef, {
      text,
      from: this.currentUser.email,
      to: emailToNotificate,
      createdAt: serverTimestamp()
    });
  }

}
