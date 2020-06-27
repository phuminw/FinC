import { Injectable } from '@angular/core';
import { NgxPlaidLinkService } from "ngx-plaid-link"
import { PlaidConfig } from "ngx-plaid-link/lib/interfaces"
import { PlaidLinkHandler } from "ngx-plaid-link/lib/ngx-plaid-link-handler"
import { HttpClient } from "@angular/common/http";
import * as plaid from "plaid"
import fetch from "node-fetch";
import { Router } from '@angular/router';

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
    clientName: "Finc",
  }
  
  constructor(private http: HttpClient, private router: Router) {
    this.plaidService = new NgxPlaidLinkService()
  }

  /* Plaid Link Section */

  /**
   * Going through Plaid Link procedure and record access token to db
   * 
   * @return user access token
   */

  async getAccessToken(): Promise<boolean> {
    try {
      if (this.plaidLinkHandler == null) {
        this.plaidLinkHandler = await this.plaidService.createPlaid(this.config)
        this.plaidLinkHandler.open()
      }
      else {
        this.plaidLinkHandler.open()
      }

      return true
    } catch (_) {
      window.location.replace('/')
    }
  }

  async onSuccess(publictoken: string) {
    if ((await (await fetch('/api/plaid/plaidPTHandler', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({publictoken: publictoken})
    })).json()).success) {
      window.location.replace('/')
      // this.router.navigateByUrl('/')
    }
    // $.post('/api/plaid/plaidPTHandler', {username: "phuminw", publictoken: publictoken})
  }

  onExit(_error, _metadata) {
    window.location.replace('/')
    // this.router.navigateByUrl('/auth/home')
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
  // getAccountsInfo(accessToken: string): Promise<AccountReply> {
  //   return this.http.get<AccountReply>('/api/plaid/getAccountsInfo', {params: {
  //     accessToken: accessToken
  //   }}).toPromise()
  //   .then(res => {
  //     return res
  //   })
  //   .catch(err => {
  //     console.log(err)
  //     return null
  //   })
  // }

}
