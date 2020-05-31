import { Component, OnInit } from '@angular/core';
import {LoginComponent} from '../../components/login/login.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  preloader = false;

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.preloader = true;
        setTimeout(() => {
            this.preloader = false;
        }, 2000);
      }
    });
  }

  ngOnInit(): void {
  }

  scrollToElement(element): void {
    console.log(element);
    element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  }

}
