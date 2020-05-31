import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Material
import { MaterialModule } from './material.components';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Pages
import { HomePageComponent } from './pages/home-page/home-page.component';
import { StatisticsPageComponent } from './pages/statistics-page/statistics-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

// EXPORT EXCEL
import { ExporterService } from './services/exporter.service';
import { CreateFishModalComponent } from './components/create-fish-modal/create-fish-modal.component';
import { LoginComponent } from './components/login/login.component';


@NgModule({
  declarations: [
    AppComponent,
    StatisticsPageComponent,
    MainPageComponent,
    PageNotFoundComponent,
    HomePageComponent,
    CreateFishModalComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,

    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
  ],
  providers: [ExporterService],
  bootstrap: [AppComponent],
})
export class AppModule {}
