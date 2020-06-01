import { Injectable } from '@angular/core';
import { NgxPlaidLinkService } from "ngx-plaid-link"
import { PlaidConfig } from "ngx-plaid-link/lib/interfaces"
import { PlaidLinkHandler } from "ngx-plaid-link/lib/ngx-plaid-link-handler"
import { HttpClient } from "@angular/common/http";
import * as plaid from "plaid"
import * as $ from "jquery";

export interface AccountReply {
    success: boolean,
    insName: string,
    accounts: plaid.Account[]
}

@Injectable({
  providedIn: 'root'
})
export class PlaidService {
  private plaidLinkHandler: PlaidLinkHandler = null
  private plaidService: NgxPlaidLinkService
  private ENV: string = plaid.environments.sandbox

  private config: PlaidConfig = {
    apiVersion: "v2",
    env: "sandbox",
    key: "cc102feae85c5c5079aa972a069efb",
    webhook: "http://webhook.com",
    product: ["transactions"],
    onSuccess: this.onSuccess,
    onExit: this.onExit,
    clientName: "Finc Client Service"
  }
  
  constructor(private http: HttpClient) {
    this.plaidService = new NgxPlaidLinkService()
  }

  /* Plaid Link Section */

  /**
   * Going through Plaid Link procedure and record acces token to db
   * 
   * @return user access token
   */

  getAccessToken(): void {
    if (this.plaidLinkHandler == null) {
      this.plaidService.createPlaid(this.config)
      .then((handler: PlaidLinkHandler) => {
        this.plaidLinkHandler = handler
        this.plaidLinkHandler.open()
      })
      .catch(err => console.error("Plaid service initialization failed: " + err))
    }
    else {
      this.plaidLinkHandler.open()
    }
  }

  onSuccess(publictoken: string, metadata): void {
    $.post('/api/plaid/plaidPTHandler', {username: "phuminw", publictoken: publictoken})
  }

  onExit(error, metadata) {

  }

  /* Plaid Client Section */

  /**
   * Query all accounts access token
   */

  /**
   * Query all accounts and institution info of a given access token
   * 
   * @param accessToken 
   */
  getAccountsInfo(accessToken: string): Promise<AccountReply> {
    return this.http.get<AccountReply>('/api/plaid/getAccountsInfo', {params: {
      accessToken: accessToken
    }}).toPromise()
    .then(res => {
      return res
    })
    .catch(err => {
      console.log(err)
      return null
    })
  }

}
