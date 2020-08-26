import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from "@angular/forms";
import { MongoService } from "../mongo.service";
import { InstitutionSummary } from "../interface";

@Component({
  selector: 'app-remove-account',
  templateUrl: './remove-account.component.html',
  styleUrls: ['./remove-account.component.css']
})
export class RemoveAccountComponent implements OnInit {
  institutions: InstitutionSummary[]
  toRemoveForm: FormGroup
  fetchedAllInstitutions: boolean
  totalInstitutions: number

  serverError: boolean
  serverErrorMessage: string

  constructor(private mongoService: MongoService) {
    this.toRemoveForm = new FormGroup({})
    this.fetchedAllInstitutions = false
  }

  async ngOnInit() {
      this.institutions = (await this.mongoService.getInsSummary())
      for (let i = 0 ; i < this.institutions.length ; i++)
        this.toRemoveForm.addControl(this.institutions[i].id, new FormControl(false))

    this.fetchedAllInstitutions = true
  }

  async removeAccount() {
    let rm_ids = [] as string[]

    for (let prop in this.toRemoveForm.value) {
      if (Object.prototype.hasOwnProperty.call(this.toRemoveForm.value, prop)) {
        if (this.toRemoveForm.value[prop]) {
          rm_ids.push(prop)
        }
      }
    }

    let response = await this.mongoService.removeInstitutions(rm_ids)
    if (response === true)
      window.location.replace('/')
    else {
      // TODO: Display internal server error message on component HTML and setTimeout for redirect
      this.serverError = true
      this.serverErrorMessage = (response === false) ? "Cannot connect to the server" : response
    }
  }
}
