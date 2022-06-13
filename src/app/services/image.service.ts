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
export class ImageService {

  currentUser: User = null;
  isTestDevelopedActive: boolean = environment.isTestDevelopedActive;
  imagesListUrl: string[] = [];

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage
  ) {
    this.auth.onAuthStateChanged(user => {
      this.currentUser  = user;
    });
  }

  async getImagesListSend() {
    this.imagesListUrl = [];
    const user = this.auth.currentUser;
    const path = `uploads/${user?.uid}`;
    const storageRef = ref(this.storage, path);

    try {
      const listImagesRef = await list(storageRef);
      for (const imageRef of listImagesRef.items) {
        const storageRef = ref(this.storage, imageRef.fullPath);
        const imageUrl = await getDownloadURL(storageRef);
        this.imagesListUrl.push(imageUrl);
      }
      return this.imagesListUrl;
    } catch (e) {
      return null;
    }
  }

  async getImagesListReceived(userToChat) {
    this.imagesListUrl = [];
    const user = this.auth.currentUser;
    const path = `uploads/${userToChat?.uid}`;
    const storageRef = ref(this.storage, path);

    try {
      const listImagesRef = await list(storageRef);
      for (const imageRef of listImagesRef.items) {
        const storageRef = ref(this.storage, imageRef.fullPath);
        const imageUrl = await getDownloadURL(storageRef);
        this.imagesListUrl.push(imageUrl);
      }
      return this.imagesListUrl;
    } catch (e) {
      return null;
    }
  }

  async uploadImage(cameraFile: Photo, fileName: string) {
    const user = this.auth.currentUser;
    const path = `uploads/${user.uid}/${fileName}`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, cameraFile.base64String, 'base64');
      const imageUrl = await getDownloadURL(storageRef);
      const messagesDocRef = collection(this.firestore, !this.isTestDevelopedActive ? 'messages' : 'messagesTest');
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
