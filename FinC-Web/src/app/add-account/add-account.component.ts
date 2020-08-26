import { Component, OnInit } from '@angular/core'
import { PlaidService } from "../plaid.service";
import { MongoService } from "../mongo.service";

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit {  
  calledPlaid: boolean

  constructor(private plaidService: PlaidService, private mongoService: MongoService) { }
  
  async ngOnInit() {
    // if (this.mongoService.isLogin()) {
      // if ((await this.mongoService.getAllAccounts()).length == 0)
      //   this.noAccount = true
      // else
        this.plaidService.getAccessToken()
        this.calledPlaid = true
    // }
    // else {
    //   // TODO: redirect to login
    // }
  }
}
