import { RecordingData } from 'capacitor-voice-recorder';
import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { addDoc, collection, doc, docData, Firestore, serverTimestamp } from '@angular/fire/firestore';
import { ref, Storage } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';
import { getDownloadURL, list, uploadString } from 'firebase/storage';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  currentUser: User = null;
  isTestDevelopedActive: boolean = environment.isTestDevelopedActive;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage
  ) {
    this.auth.onAuthStateChanged(user => {
      this.currentUser  = user;
    });
  }

  async uploadRecord(data: RecordingData, fileName: string) {
    const user = this.auth.currentUser;
    const path = `uploads/${user.uid}/${fileName}`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, data.value.recordDataBase64, 'base64');
      const messagesDocRef = collection(this.firestore, !this.isTestDevelopedActive ? 'messages' : 'messagesTest');
      await addDoc(messagesDocRef, {
      base64String: data.value.recordDataBase64,
      from: this.currentUser.uid,
      createdAt: serverTimestamp(),
      record: true
    });
      return true;
    } catch (e) {
      return null;
    }
  }
}
