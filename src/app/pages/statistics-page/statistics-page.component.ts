import { Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Chart } from 'chart.js';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ExporterService } from 'src/app/services/exporter.service';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}

/** Constants used to fill up our data base. */
const COLORS: string[] = [
  'maroon',
  'red',
  'orange',
  'yellow',
  'olive',
  'green',
  'purple',
  'fuchsia',
  'lime',
  'teal',
  'aqua',
  'blue',
  'navy',
  'black',
  'gray',
];
const NAMES: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];
export interface Estadisticas { estanqueId: string; biomasa: number; fecha: string; }
export interface Estanque { id?: string; name: string; peces?: Array<string>; pesoTotal?: number; }


@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.scss'],
})
export class StatisticsPageComponent implements OnInit {
  displayedColumns: string[] = ['name', 'quantity', 'size', 'actions'];
  dataSource: MatTableDataSource<Estanque>;

  displayedColumns2: string[] = ['name', 'biomasa', 'date'];
  dataSource2: MatTableDataSource<Estadisticas>;


  preloader = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  // Se declara los datos de pastel como arreglo
  graficoPastel = [];

  // Firestore
  private estadisticasCollection: AngularFirestoreCollection<Estadisticas>;
  private estanqueCollection: AngularFirestoreCollection<Estanque>;
  estanques: Observable<Estanque[]>;
  public estanqueOption: Estanque;

  constructor(
    public fbService: FirebaseService,
    private firestore: AngularFirestore,
    private excelService: ExporterService
  ) {
    const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource(users);
    // Firestore
    this.estadisticasCollection = firestore.collection<Estadisticas>('Estadisticas');
    this.estadisticasCollection.valueChanges().subscribe( response => {
      // console.log(response);
      this.dataSource2 = new MatTableDataSource(response);
    });
    this.estanqueCollection = firestore.collection<Estanque>('Estanque');
    // this.estanqueCollection.valueChanges().subscribe( response => {
    //   console.log(response);
    //   this.dataSource = new MatTableDataSource(response);
    // });
    this.estanques = this.estanqueCollection.snapshotChanges().pipe(
      map( values => values.map(a => {
        const data = a.payload.doc.data() as Estanque;
        const id = a.payload.doc.id;
        this.dataSource = new MatTableDataSource([{ id, ...data }]);
        return { id, ...data };
        })
      ));
  }

  calculo() {
    const newData = {
      estanqueId: this.estanqueOption.id,
      name: this.estanqueOption.name,
      biomasa: this.estanqueOption.pesoTotal * (this.estanqueOption.pesoTotal / this.estanqueOption.peces.length),
      fecha: Date()
    };
    this.estadisticasCollection.add(newData).then( res => {
      // console.log(res);
      console.log('Se ha calculado la biomasa');
    }, error => {
      console.log(error);
    });
  }

  eliminar(id: any) {
    // console.log(id);
    this.estanqueCollection.doc(id).delete().then( res => {
      console.log('Se ha eliminado correctamente el estanque');
    }).catch(err => {
      console.log('Se ha producido un error ' + err);
    });
  }

  logout() {
    this.preloader = true;
    setTimeout( () => {
      this.preloader = false;
      this.fbService.logout();
    }, 2500);
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // CREACION DE LA GRAFICA
    this.graficoPastel = new Chart('chartPastel', {
      type: 'pie',
      data: {
        labels: ['Disminución', 'Crecimiento'],
        datasets: [
          {
            label: '',
            data: [5, 5],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: ['rgba(255,99,132,1)', 'rgba(75, 192, 192, 1)'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        title: {
          text: 'Grafica Sobre Crecimiento o Disminución',
          display: true,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
    // TERMINA LA GRAFICA
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportarExcel(): void {
    this.excelService.exportarExcel(this.dataSource.data, 'my_export');
  }

  exportarExcelFiltrado(): void {
    this.excelService.exportarExcel(this.dataSource.filteredData, 'my_export');
  }
}

/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
    ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
    '.';

  return {
    id: id.toString(),
    name,
    progress: Math.round(Math.random() * 100).toString(),
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))],
  };
}
