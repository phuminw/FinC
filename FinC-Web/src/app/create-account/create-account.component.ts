import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {
  new_account_form: FormGroup
  hide: boolean = true
  signupErrorMessage: boolean = false

  constructor(private userService: UserService, private router: Router) {
    this.new_account_form = new FormGroup({})
  }

  ngOnInit(): void {
    this.new_account_form.addControl(`username`, new FormControl())
    this.new_account_form.addControl(`password`, new FormControl())

  }

  async signup() {
    if (await this.userService.signup(this.new_account_form.value.username, this.new_account_form.value.password) === true) {
      this.router.navigateByUrl('/')
    }
    else {
      this.signupErrorMessage = true
    }
  }
}
