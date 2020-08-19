import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaterialsComponent } from './materials/materials.component';

const routes: Routes = [
  { path: 'materials/list', component: MaterialsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
