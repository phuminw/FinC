import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { PlaidService, AccountReply } from "../plaid.service";
import { MongoService } from "../mongo.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private totalInstitutions: number
  fetchedAllInstitutions: boolean
  db: AccountReply[]

  constructor(private router: Router, private plaidService: PlaidService, private mongoService: MongoService) {
    this.db = []
    this.fetchedAllInstitutions = false
  }

  ngOnInit(): void {
    this.mongoService.getAllAccounts().then(accessTokens => {
      this.totalInstitutions = accessTokens.length

      accessTokens.forEach(at => {
        this.plaidService.getAccountsInfo(at).then(accInfo => {
          this.db.push(accInfo)
          if (this.db.length == this.totalInstitutions)
            this.fetchedAllInstitutions = true
        })
        .catch(err => {
          console.error(`Query account info ${at} from Plaid error ` + err)
        })
      })
    })
    .catch(err => {
      console.error(err)
    })
    // this.plaidService.getAccountsInfo("access-sandbox-ae70d2ed-4f00-4a0d-af84-552cf97e63eb").then(res => {this.db = res})
    // this.router.navigate(['/'])
    // async () => {
    //   this.db = await this.plaidService.getAccounts("access-sandbox-ae70d2ed-4f00-4a0d-af84-552cf97e63eb")
    //   console.log(this.db)
    // }
  }

  // public redirect(): void {
  //   this.router.navigate(['/'])
  // }
}
