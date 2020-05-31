import { Exporter2Service } from './../../services/exporter2.service';
import { Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Chart } from 'chart.js';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ExporterService } from 'src/app/services/exporter.service';
import {AngularFirestore, AngularFirestoreCollection,AngularFirestoreDocument} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export interface Estadisticas { estanqueId: string; biomasa: number; fecha: string; }
export interface Estanque { id?: string; name: string; peces?: Array<string>; pesoTotal?: number; }


@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.scss'],
})
export class StatisticsPageComponent implements OnInit, AfterViewInit{
    estanqueDoc: AngularFirestoreDocument<Estanque>;

  displayedColumns: string[] = ['name', 'quantity', 'size', 'actions'];
  dataSource: MatTableDataSource<Estanque>;

  displayedColumns2: string[] = ['name', 'biomasa', 'date'];
  dataSource2: MatTableDataSource<Estadisticas>;


  preloader = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator2: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort2: MatSort;
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
    private excelService: ExporterService,
private excelService2: Exporter2Service
  ) {

    // Assign the data to the data source for the table to render
    // Firestore
    this.estadisticasCollection = firestore.collection<Estadisticas>('Estadisticas');
    this.estadisticasCollection.valueChanges().subscribe( response => {
      // console.log(response);
      this.dataSource2 = new MatTableDataSource(response);
    });

        this.estanqueCollection = firestore.collection<Estanque>('Estanque');

      this.estanques = this.estanqueCollection.snapshotChanges().pipe(
      map( values => values.map(a => {
        const data = a.payload.doc.data() as Estanque;
        const id = a.payload.doc.id;
        return { id, ...data };
        })
        ));

    //AQUI SE MUESTRA EN LA TABLA
    this.estanqueCollection.valueChanges().subscribe(response => {
     console.log(response)
      this.dataSource = new MatTableDataSource(response);
    });
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

this.estanqueCollection.doc(id).delete().then( res => {
      console.log('Se Ha Eliminado correctamente el estanque');
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

  }

  ngAfterViewInit() {


       // CREACION DE LA GRAFICA
  this.graficoPastel = new Chart('pieChart', {
  type: 'pie',
data: {
 labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
 datasets: [{
     label: '# of Votes',
     data: [9,7 , 3, 5, 2, 10],
     backgroundColor: [
         'rgba(255, 99, 132, 0.2)',
         'rgba(54, 162, 235, 0.2)',
         'rgba(255, 206, 86, 0.2)',
         'rgba(75, 192, 192, 0.2)',
         'rgba(153, 102, 255, 0.2)',
         'rgba(255, 159, 64, 0.2)'
     ],
     borderColor: [
         'rgba(255,99,132,1)',
         'rgba(54, 162, 235, 1)',
         'rgba(255, 206, 86, 1)',
         'rgba(75, 192, 192, 1)',
         'rgba(153, 102, 255, 1)',
         'rgba(255, 159, 64, 1)'
     ],
     borderWidth: 1
 }]
},
options: {
 title:{
     text:"Bar Chart",
     display:true
 },
 scales: {
     yAxes: [{
         ticks: {
             beginAtZero:true
         }
     }]
 }
}
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

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }

  exportarExcel(): void {
    this.excelService.exportExcel(this.dataSource.data, 'my_export');
  }

  exportarExcelFiltrado(): void {
    this.excelService.exportExcel(this.dataSource.filteredData, 'my_export');
  }

   exportarExcel2(): void {
    this.excelService2.exportExcel(this.dataSource2.data, 'my_export');
  }

  exportarExcelFiltrado2(): void {
    this.excelService2.exportExcel(this.dataSource2.filteredData, 'my_export');
  }
}
