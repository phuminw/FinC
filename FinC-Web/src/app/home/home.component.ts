import { Component, OnInit } from '@angular/core';
import { MongoService } from "../mongo.service";
import { InstitutionAccountsInfo } from "../interface";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private totalInstitutions: number
  fetchedAllInstitutions: boolean
  institutions: InstitutionAccountsInfo[]

  constructor(private mongoService: MongoService) {
    this.institutions = []
    this.fetchedAllInstitutions = false
  }

  async ngOnInit() {  
    this.institutions = await this.mongoService.getAllAccounts()
    this.fetchedAllInstitutions = true
  }
}
