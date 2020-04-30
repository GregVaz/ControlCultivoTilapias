import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  public app;
  public uid;
  public msgError: string;

  constructor() { 
    this.app = firebase.initializeApp(environment.firebaseConfig);
  }

  session() {
    return new Promise( (resolve) => {
      this.app.auth().onAuthStateChanged((user) => {
        if (user) {
          this.uid = user.uid;
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  login(value) {
    return new Promise( (resolve, reject) => {
      this.app.auth().signInWithEmailAndPassword(value.email, value.password).then((res: any) => {
          localStorage.setItem('session', JSON.stringify({uid: res.user.uid, email: res.user.email} ));
          this.uid = res.user.uid;
          resolve(true);
      }).catch(err => {
        this.msgError = this.authErrorCodeMsg(err.code);
        reject(false);
      });
    });
  }

  logout() {
    return new Promise( (resolve) => {
      this.app.auth().signOut().then( _ => {
        console.log('Se ha cerrado la sesion');
        localStorage.removeItem('session');
        localStorage.clear();
        window.location.reload();
        resolve();
      }).catch( err => {
        console.log(err);
      });
    });
  }

  authErrorCodeMsg(code) {
    return code === 'auth/invalid-email' ? 'Correo electrónico invalido' :
      code === 'auth/wrong-password' ? 'Contraseña incorrecta' :
      code === 'auth/user-not-found' ? 'Correo electrónico incorrecto' : 'Usuario desactivado, contactar con el administrador';
  }
}
