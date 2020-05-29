import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatisticsPageComponent } from './pages/statistics-page/statistics-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import {HomePageComponent} from './pages/home-page/home-page.component';


const routes: Routes = [
  {
    path: 'inicio',
    component: HomePageComponent
  },
  {
    path: 'estadisticas',
    component: StatisticsPageComponent
  },
  {
    path: 'principal',
    component: MainPageComponent
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
