import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from "@angular/forms";
import { PlaidService } from "../plaid.service";
import { MongoService } from "../mongo.service";

interface InstitutionSummary {
  insName: string,
  accCount: number,
  accessToken: string,
  index: number
}

@Component({
  selector: 'app-remove-account',
  templateUrl: './remove-account.component.html',
  styleUrls: ['./remove-account.component.css']
})
export class RemoveAccountComponent implements OnInit {
  institutions: InstitutionSummary[] = []
  private indexToAccessToken: Object = {}
  toRemoveForm: FormGroup

  constructor(private plaidService: PlaidService, private mongoService: MongoService) {
    this.toRemoveForm = new FormGroup({})
  }

  ngOnInit(): void {
    let i = 0

    this.mongoService.getAllAccounts()
    .then(tokens => {
      tokens.forEach(token => {
        this.plaidService.getAccountsInfo(token)
        .then(reply => {
          this.institutions.push({insName: reply.insName, accCount: reply.accounts.length, accessToken: token, index: ++i})
          this.toRemoveForm.addControl(`${i}`, new FormControl(false))
          this.indexToAccessToken[`${i}`] = token
          })
        })
      })
    .catch(err => {
      console.error(`Query access tokens error ${err}`)
    })
  }

  removeAccount(): void {
    for (let prop in this.toRemoveForm.value) {
      if (Object.prototype.hasOwnProperty.call(this.toRemoveForm.value, prop)) {
        if (this.toRemoveForm.value[prop]) {
          console.log(`Removing ${this.indexToAccessToken[prop]} from component`)
          this.mongoService.removeAccount(this.indexToAccessToken[prop]).then(res => {console.log(`Removing ${res}`);location.reload()}, err => console.error(err))
        }
      }
    }
  }
}
