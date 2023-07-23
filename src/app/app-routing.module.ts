import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BottomupVisComponent } from './bottomup-vis/bottomup-vis.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VishomeComponent } from './vishome/vishome.component';
import{FullTreeComponent} from './full-tree/full-tree.component';

const routes: Routes = [
{ path: '', component: DashboardComponent },

{ path: ':file', component: DashboardComponent },
{ path: 'search/:searchterm', component: DashboardComponent },
{ path: 'refsearch/:searchrefterm', component: DashboardComponent },

{ path: 'tree/:file/:chapter', component: VishomeComponent },

{ path: 'buildtree/:file', component: BottomupVisComponent },
{ path: 'fulltree/:keyword', component: FullTreeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
