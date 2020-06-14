import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddAccountComponent } from "./add-account/add-account.component";
import { HomeComponent } from "./home/home.component";
import { RemoveAccountComponent } from "./remove-account/remove-account.component";
import { LoginComponent } from "./login/login.component";

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'addAccount', component: AddAccountComponent},
  {path: 'home', component: HomeComponent},
  {path: 'removeAccount', component: RemoveAccountComponent},
  {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
