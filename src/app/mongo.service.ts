import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { SimpleResponse, UsernameQueryResponse, AccountsQueryResponse, InstitutionAccountsInfo, InstitutionsSummary, InstitutionSummary } from "./interface";

// interface UserAccountReply {
//   success: boolean,
//   accessTokens?: string[]
// }

// interface DBUpdateReply {
//   success: boolean
// }

// interface UsernameReply {
//   success: boolean,
//   username?: string
// }

@Injectable({
  providedIn: 'root'
})
export class MongoService {
  username: string

  constructor(private http: HttpClient) {
  }

  /**
   * Determine whether user is logged in or not
   * 
   * @return `boolean` indicating log in status
   */

  async isLogin(): Promise<boolean> {
    return (await this.getUsername()) !== 'Guest'
  }

  /**
   * Query username
   * 
   * @return username or "Guest" if not logged in
   */

  async getUsername(): Promise<string> {
    try {
      let respoonse = await this.http.get<UsernameQueryResponse>('/api/db/username').toPromise()
      if (respoonse.success)
        return respoonse.username
    } catch (_) {}

    return "Guest"
    // return this.http.get<UsernameQueryResponse>('/api/db/getUsername').toPromise()
    // .then(res => {
    //   if (res.success)
    //     return res.username
    //   else
    //     return "Guest"
    // })
    // .catch(err => {
    //   console.log(err)
    //   return "Guest"
    // })
  }

  /**
   * Query all accounts from all institutions
   * 
   * @return array of `AccountsQueryResponse` or an empty array
   */

  async getAllAccounts(): Promise<InstitutionAccountsInfo[]> {
    try {
      let response = await this.http.get<AccountsQueryResponse>('/api/db/accounts').toPromise()
      if (response.success)
        return response.institutions
    } catch (_) {}

    return [] as InstitutionAccountsInfo[]

    // return this.http.get<UserAccountReply>('/api/db/getAccounts', {params: {username: "phuminw"}}).toPromise()
    // .then(res => {
    //   if (res.success) {
    //     // console.log(res)
    //     return res.accessTokens
    //   }
    //   else {
    //     return []
    //   }
    // })
    // .catch(err => {
    //   console.error("Query access token error " + err)
    //   return []
    // })
  }

  /**
   * Query a summary detail of all institutions of a user
   * 
   * @return Array of `InstitutionSummary` or an empty array
   */

  async getInsSummary(): Promise<InstitutionSummary[]> {
    try {
      let response = await this.http.get<InstitutionsSummary>('/api/db/insSummary').toPromise()
      if (response.success)
        return response.institutions
    } catch (_) {}

    return [] as InstitutionSummary[]
  }

  /**
   * Remove the given institutions from the database
   * 
   * @param ids institution ids to be removed
   */

  async removeInstitutions(ids: string[]): Promise<boolean|string> {
    // console.log(`MongoService removing ${ins_id}`)
    try {
      const response = await this.http.post<SimpleResponse>('/api/db/removeIns', {
        ids: ids
      }).toPromise();
      if (response.success)
        return true
      return response.error
    }
    catch (_) {
      return false;
    }
  }
}
