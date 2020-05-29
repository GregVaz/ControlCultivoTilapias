import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
  import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  @Output() loginSuccessful = new EventEmitter();
  showAlertDiv: boolean;
  messageAlertDiv = '';
  formLogin: FormGroup;
  hide = true;
  preloader = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private fbService: FirebaseService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.formLogin = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    this.preloader = true;
    this.fbService.login(this.formLogin.value).then( res => {
      if (res) {
        // setTimeout(() => {
          this.showAlertDiv = false;
          this.preloader = false;
          this.router.navigate(['estadisticas/']);
          // window.location.reload();
          this.loginSuccessful.emit();
        // }, 2000);
      }
    }).catch( err => {
      if (this.fbService.msgError === '') {
        this.fbService.msgError = 'Sin comunicación, por favor intentelo mas tarde.';
      }
      setTimeout(() => {
        this.preloader = false;
        this.showAlertDiv = true;
        this.messageAlertDiv = this.fbService.msgError;
      }, 2000);
    });
  }

  getEmailErrorMessage() {
    return this.formLogin.get('email').hasError('required') ? 'Necesitas ingresar un nombre de usuario' :
      this.formLogin.get('email').hasError('email') ? 'No es un correo valido' :
        '';
  }

  getPasswordErrorMessage() {
    return this.formLogin.get('password').hasError('required') ? 'Necesitas ingresar tu contraseña' :
      '';
  }

}
