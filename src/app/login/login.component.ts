import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from "../user.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  hide: boolean = true
  loginErrorMessage: boolean = false

  constructor(private userService: UserService, private router: Router) {
    this.loginForm = new FormGroup({})
  }

  ngOnInit() {
    this.loginForm.addControl(`username`, new FormControl())
    this.loginForm.addControl(`password`, new FormControl())
  }

  async login() {
    if ((await this.userService.login(this.loginForm.value.username, this.loginForm.value.password))) {
      this.router.navigateByUrl('/')
    }
    else {
      this.loginErrorMessage = true
    }
    // .then(success => {
    //   if (!success)
    //     this.loginErrorMessage = true
    //   else
    //     window.location.replace('/')
    // })
    // .catch(err => console.error(err))
  }
}
