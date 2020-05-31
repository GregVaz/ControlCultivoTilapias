import {Component, OnInit, Inject, Output, EventEmitter} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {FirebaseService} from '../../services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  showAlertDiv: boolean;
  messageAlertDiv = '';
  formLogin: FormGroup;
  hide = true;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private fbService: FirebaseService,
              public dialogRef: MatDialogRef<LoginComponent>) {}

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
    this.fbService.login(this.formLogin.value).then( res => {
      if (res) {
        this.dialogRef.close();
        setTimeout(() => {
        this.router.navigate(['estadisticas']);
        }, 2000);
      }
    }).catch( err => {
      if (this.fbService.msgError === '') {
        this.fbService.msgError = 'Sin comunicación, por favor intentelo mas tarde.';
      }
      setTimeout(() => {
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

  onNoClick(): void {
    this.dialogRef.close();
  }

}
