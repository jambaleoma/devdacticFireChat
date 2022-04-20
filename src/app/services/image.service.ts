import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { addDoc, collection, doc, docData, Firestore, serverTimestamp } from '@angular/fire/firestore';
import { ref, Storage } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';
import { getDownloadURL, uploadString } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  currentUser: User = null;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage
  ) {
    this.auth.onAuthStateChanged(user => {
      this.currentUser  = user;
    });
  }

  getUserProfile() {
    const user = this.auth.currentUser;
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    return docData(userDocRef);
  }

  async uploadImage(cameraFile: Photo, fileName: string) {
    const user = this.auth.currentUser;
    const path = `uploads/${user.uid}/${fileName}`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, cameraFile.base64String, 'base64');
      const imageUrl = await getDownloadURL(storageRef);
      const messagesDocRef = collection(this.firestore, `messagesTest`);
      await addDoc(messagesDocRef, {
      base64String: imageUrl,
      from: this.currentUser.uid,
      createdAt: serverTimestamp(),
      image: true
    });
      return true;
    } catch (e) {
      return null;
    }
  }
}
