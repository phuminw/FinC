import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

interface UserAccountReply {
  success: boolean,
  accessTokens?: string[]
}

interface DBUpdateReply {
  success: boolean
}

interface UsernameReply {
  success: boolean,
  username?: string
}

@Injectable({
  providedIn: 'root'
})
export class MongoService {
  constructor(private http: HttpClient) {
  }

  getUsername(): Promise<string> {
    return this.http.get<UsernameReply>('/api/db/getUsername').toPromise()
    .then(res => {
      if (res.success)
        return res.username
      else
        return "Guest"
    })
    .catch(err => {
      console.log(err)
      return "Guest"
    })
  }

  getAllAccounts(): Promise<string[]> {
    return this.http.get<UserAccountReply>('/api/db/getAccounts', {params: {username: "phuminw"}}).toPromise()
    .then(res => {
      if (res.success) {
        // console.log(res)
        return res.accessTokens
      }
      else {
        return []
      }
    })
    .catch(err => {
      console.error("Query access token error " + err)
      return []
    })
  }

  removeAccount(accessToken: string): Promise<boolean> {
    console.log(`MongoService removing ${accessToken}`)
    return this.http.post<DBUpdateReply>('/api/db/removeAccount', {username: "phuminw", accessToken: accessToken}).toPromise()
    .then(res => {
      return res.success
    })
    .catch(err => {
      return false
    })
  }
}
