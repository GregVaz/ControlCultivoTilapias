import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(public fbService: FirebaseService ) { }

  ngOnInit(): void {
  }

  scrollToElement(element): void {
    console.log(element);
    element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  }

}
