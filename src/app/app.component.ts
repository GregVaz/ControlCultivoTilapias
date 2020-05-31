import { Component } from '@angular/core';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'control-cultivo-tilapias';
  activeSession: boolean;
  load = false;

  constructor(private fbService: FirebaseService) {
    this.checkLogin();
  }

  ngOnInit(): void {
  }

  checkLogin() {
    this.fbService.session().then( (res: boolean) => {
      this.activeSession = res;
      this.load = true;
    });
  }

  // changeStatus() {
  //   this.activeSession = !this.activeSession;
  // }

  
}
