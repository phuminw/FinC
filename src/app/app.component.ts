import { Component, OnInit } from '@angular/core';
import { MongoService } from "./mongo.service";
import { UserService } from "./user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'FinC'
  username: string
  loggedin: boolean
  
  constructor(private mongoService: MongoService, private userService: UserService) {

  }

  async ngOnInit() {
    this.username = await this.mongoService.getUsername()
    if (this.username === "Guest")
      this.loggedin = false
    else
      this.loggedin = true
  }

  logout() {
    
  }
}
