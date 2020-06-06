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
  fetchedAllIns: boolean
  private totalInstitutions: number

  constructor(private plaidService: PlaidService, private mongoService: MongoService) {
    this.toRemoveForm = new FormGroup({})
    this.fetchedAllIns = false
  }

  ngOnInit(): void {
    let i = 0

    this.mongoService.getAllAccounts()
      .then(tokens => {
        this.totalInstitutions = tokens.length
        
        tokens.forEach(token => {
          this.plaidService.getAccountsInfo(token)
            .then(reply => {
              this.institutions.push({ insName: reply.insName, accCount: reply.accounts.length, accessToken: token, index: ++i })
              if (this.totalInstitutions == this.institutions.length) {
                this.fetchedAllIns = true
                this.institutions.forEach(ins => {
                  this.toRemoveForm.addControl(`${ins.index}`, new FormControl(false))
                  this.indexToAccessToken[`${ins.index}`] = token
                })
              }
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
          let temp = this.mongoService.removeAccount(this.indexToAccessToken[prop])
          temp.then(res => {
            console.log(`Removing ${res}`)
            location.replace('/')
          }, err => console.error(err))
        }
      }
    }
  }
}
