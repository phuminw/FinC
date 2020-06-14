import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from "../user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  hide: boolean = true
  loginErrorMessage: boolean = false

  constructor(private userService: UserService) {
    this.loginForm = new FormGroup({})
  }

  ngOnInit(): void {
    this.loginForm.addControl(`username`, new FormControl())
    this.loginForm.addControl(`password`, new FormControl())
  }

  login() {
    console.log(this.loginForm.value)
    this.userService.login(this.loginForm.value.username, this.loginForm.value.password)
    .then(success => {
      if (!success)
        this.loginErrorMessage = true
      else
        window.location.replace('/')
    })
    .catch(err => console.error(err))
  }
}
