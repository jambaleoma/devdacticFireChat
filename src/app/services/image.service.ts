import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { ref, Storage } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';
import { getDownloadURL, uploadString } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage
  ) { }

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

      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userDocRef, {
        imageUrl
      });
      return true;
    } catch (e) {
      return null;
    }
  }
}
