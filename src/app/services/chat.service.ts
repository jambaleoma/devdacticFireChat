import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { Photo } from '@capacitor/camera';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { addDoc, collection, doc, limitToLast, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { Observable, Subject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Message } from '../model/Message';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  isTestDevelopedActive: boolean = environment.isTestDevelopedActive;
  currentUser: User = null;
  private newMessageSubject = new Subject<any>();

  constructor(
    private afAuth: Auth,
    private firestore: Firestore
  ) {
    this.afAuth.onAuthStateChanged(user => {
      this.currentUser = user;
    });
  }

  async signUp({email, password, username}) {
   const credential = await createUserWithEmailAndPassword(this.afAuth, email, password);

   const uid = credential.user.uid;

   const userDocRef = doc(this.firestore, !this.isTestDevelopedActive ? `users/${uid}` : `usersTest/${uid}`);

   return setDoc(userDocRef, {
     uid,
     email: credential.user.email,
     username,
     isOnline: true,
     lastAccess: serverTimestamp()
  });
  }

  signIn({email, password}) {
    return signInWithEmailAndPassword(this.afAuth, email, password);
  }

  async signOut() {
    await this.setIsOnline(false);
    return signOut(this.afAuth);
  }

  addChatMessage(msg) {
    const messagesDocRef = collection(this.firestore, !this.isTestDevelopedActive ? 'messages' : 'messagesTest');
    return addDoc(messagesDocRef, {
      msg,
      from: this.currentUser.uid,
      createdAt: serverTimestamp()
    });
  }

  addImageChatMessage(cameraFile: Photo) {
    const messagesDocRef = collection(this.firestore, 'messages');
    return addDoc(messagesDocRef, {
      base64String: 'data:image/png;base64,' + cameraFile.base64String,
      from: this.currentUser.uid,
      createdAt: serverTimestamp(),
      image: true
    });
  }

  getChatMessages(numeberOfMessage, toSend = true) {
    let users = [];

    return this.getUsers().pipe(
      switchMap(res => {
        users = res;
        const messagesDocRef = collection(this.firestore, !this.isTestDevelopedActive ? 'messages' : 'messagesTest');
        const q = query(messagesDocRef, orderBy('createdAt'), limitToLast(numeberOfMessage));
        return collectionData(q, {idField: 'id'}) as Observable<Message[]>;
      }),
      map(messages => {
        for (const m of messages) {
          m.fromName = this.getUserForMsg(m.from, users);
          m.myMsg = this.currentUser?.uid === m.from;
        }
        this.sendIsNewMessageArrived(toSend);
        return messages;
      })
    );
  }

  getUsers(): Observable<User[]> {
    const usersRef = collection(this.firestore, !this.isTestDevelopedActive ? 'users' : 'usersTest');
    return collectionData(usersRef, {idField: 'uid'}) as Observable<User[]>;
  }

  getUserForMsg(msgFormId, users: User[]): string {
    for (const usr of users) {
      if (usr.uid === msgFormId) {
        return usr.username;
      }
    }
    return 'Deleted';
  }

  sendIsNewMessageArrived(isNewMessageArrived: boolean) {
    this.newMessageSubject.next(isNewMessageArrived);
  }

  getIsNewMessageArrived() {
    return this.newMessageSubject.asObservable();
  }

  async setIsOnline(isOnline: boolean) {
    const userDocRef = doc(this.firestore, !this.isTestDevelopedActive ? `users/${this.currentUser?.uid}` : `usersTest/${this.currentUser?.uid}`);
    if (!isOnline) {
      await this.setLastAccess();
    }
    return updateDoc(userDocRef, {
      isOnline: isOnline
    });
  }

  setLastAccess() {
    const userDocRef = doc(this.firestore, !this.isTestDevelopedActive ? `users/${this.currentUser?.uid}` : `usersTest/${this.currentUser?.uid}`);
    return updateDoc(userDocRef, {
      lastAccess: serverTimestamp()
    });
  }

  updateUserData(parameter, dataParameter) {
    const userDocRef = doc(this.firestore, !this.isTestDevelopedActive ? `users/${this.currentUser?.uid}` : `usersTest/${this.currentUser?.uid}`);
    let data = {
      [parameter]: dataParameter,
      infoUpdateDate: null
    }
    if (parameter === 'info') {
      data.infoUpdateDate = serverTimestamp()
    }
    return updateDoc(userDocRef, data);
  }

}
