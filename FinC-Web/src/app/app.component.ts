import { Component, OnInit } from '@angular/core';
import { MongoService } from "./mongo.service";
import { UserService } from "./user.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'FinC'
  username: string
  loggedin: boolean
  
  constructor(private mongoService: MongoService, private userService: UserService, private router: Router) {

  }

  async ngOnInit() {
    this.username = this.userService.username
    if (this.username === this.userService.GUEST)
      this.loggedin = false
    else
      this.loggedin = true

    this.userService.username_pub.subscribe(username => {
      this.username = username
      if (this.username === this.userService.GUEST)
        this.loggedin = false
      else
        this.loggedin = true
    })
  }

  async logout() {
    if (await this.userService.logout())
    this.router.navigateByUrl('/login')
      // window.location.replace('/')
  }
}
