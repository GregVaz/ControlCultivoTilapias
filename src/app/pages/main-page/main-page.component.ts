import {Component, OnInit} from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2'

export interface Estanque { id?: string; name: string; peces?: Array<string>; pesoTotal?: number; }
export interface Pez { id?: string; longitud: number; peso: number; fecha?: string; }

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  preloader = false;
  formEstanque: FormGroup;
  formPez: FormGroup;
  private estanqueCollection: AngularFirestoreCollection<Estanque>;
  estanques: Observable<Estanque[]>;

  private pezCollection: AngularFirestoreCollection<Pez>;

  constructor(public fbService: FirebaseService,
              private firestore: AngularFirestore,
              private formBuilder: FormBuilder) {
    // Create 100 users
    // const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource(users);

    // Firestore
    this.estanqueCollection = firestore.collection<Estanque>('Estanque');
    this.pezCollection = firestore.collection<Pez>('Pez');
    this.estanques = this.estanqueCollection.snapshotChanges().pipe(
      map( values => values.map(a => {
        const data = a.payload.doc.data() as Estanque;
        const id = a.payload.doc.id;
        return { id, ...data };
        })
      ));
  }

  ngOnInit(): void {
    this.initialize();
    this.initializePez();


  }

  initialize() {
    this.formEstanque = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  initializePez() {
    this.formPez = this.formBuilder.group({
      estanque: [[], Validators.required],
      longitud: [0, Validators.required],
      peso: [0, Validators.required]
    });
  }

  agregarEstanque() {
    if (this.formEstanque.valid) {
      const newEstanque = {
        name: this.formEstanque.get('name').value,
        peces: [],
        pesoTotal: 0
      };
      this.estanqueCollection.add(newEstanque).then(res => {
        console.log(res);
        Swal.fire(
          'Correcto',
          'Se Ha Agregado Un Nuevo Estanque',
          'success'
        )
        console.log('Se ha agregado un nuevo estanque');
        this.initialize();
      }, error => {
        console.log(error);
      });
    } else {
       Swal.fire(
          'INCORRECTO',
          'Debes De Insertar Un Nombre',
          'error'
        )
    }


  }

  _getPezData() {
    return {
      longitud: this.formPez.get('longitud').value,
      peso: this.formPez.get('peso').value,
      fecha: Date()
    };
  }

  agregarPez() {
    this.pezCollection.add(this._getPezData()).then(res => {
      console.log('Se ha guardado la informacion del pez');
      const estanque = this.formPez.get('estanque').value;
      estanque.peces.push(res.id);
      const pesoT = estanque.pesoTotal + this.formPez.get('peso').value;
      this.estanqueCollection.doc(estanque.id).update({peces: estanque.peces, pesoTotal: pesoT}).then( () => {
        console.log('Se ha agregado el pez al estanque');
      }).catch( err => {
        console.log(err);
      });
    }).catch( err => {
      console.log(err);
    });
  }

  logout() {
    this.preloader = true;
    setTimeout( () => {
      this.preloader = false;
      this.fbService.logout();
    }, 2500);
  }

public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}


} // export class

/** Builds and returns a new User. */
// function createNewUser(id: number): UserData {
//   const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
//     NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';
//
//   return {
//     id: id.toString(),
//     name: name,
//     progress: Math.round(Math.random() * 100).toString(),
//     color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
//   };
// } // create new user


