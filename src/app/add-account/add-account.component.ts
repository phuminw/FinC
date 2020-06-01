import { Component, OnInit } from '@angular/core'
import { PlaidService } from "../plaid.service";

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit {  
  constructor(private plaidService: PlaidService) { }
  
  ngOnInit(): void {
    this.plaidService.getAccessToken()
  }
}
