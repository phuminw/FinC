import { Component, OnInit } from '@angular/core';
// import { PlaidService, AccountReply } from "../plaid.service";
import { MongoService } from "../mongo.service";
import { InstitutionAccountsInfo } from "../interface";
import fetch from 'node-fetch';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private totalInstitutions: number
  // isLogin: boolean
  fetchedAllInstitutions: boolean
  // noAccount: boolean
  institutions: InstitutionAccountsInfo[]

  constructor(private mongoService: MongoService) {
    this.institutions = []
    this.fetchedAllInstitutions = false
  }

  async ngOnInit() {  
    // if (await this.mongoService.isLogin()) {
      // this.isLogin = true
      this.institutions = await this.mongoService.getAllAccounts()
    // }
    // else {
      // TODO: Redirect to login page
    //   this.isLogin = false
    // }
    this.fetchedAllInstitutions = true
  }
}
