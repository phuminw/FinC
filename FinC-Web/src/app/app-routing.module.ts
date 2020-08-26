import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddAccountComponent } from "./add-account/add-account.component";
import { HomeComponent } from "./home/home.component";
import { RemoveAccountComponent } from "./remove-account/remove-account.component";
import { LoginComponent } from "./login/login.component";
// import { LogoutComponent } from "./logout/logout.component";
import { AuthGuard } from './auth.guard';
import { LoginGuard } from './login.guard';
import { CreateAccountComponent } from './create-account/create-account.component';

const routes: Routes = [
  {path: '', redirectTo: '/auth/home', pathMatch: 'full'},
  {path: 'auth', canActivate: [AuthGuard], children: [
      {
        path: 'addAccount', component: AddAccountComponent
      },
      {
        path: 'home', component: HomeComponent
      },
      {
        path: 'removeAccount', component: RemoveAccountComponent
      }
    ]
  },
  {path: 'login', canActivate: [LoginGuard], component: LoginComponent},
  {path: 'createAccount', canActivate: [LoginGuard], component: CreateAccountComponent},
  {path: '**', redirectTo: '/auth/home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
