/**
 * Service for user data manipulation
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SimpleResponse, LoginResponse } from "./interface";
import { Subject, Observable } from 'rxjs';
import { MongoService } from './mongo.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _GUEST: string
  private _username: string
  private _username_subject: Subject<string>
  username_pub: Observable<string>

  constructor(private http: HttpClient, private mongoService: MongoService) {
    this._GUEST = 'Guest'
    this._username = this._GUEST
    this._username_subject = new Subject<string>()
    this.username_pub = this._username_subject.asObservable()
    mongoService.getUsername().then(username => {
      if (username !== '') {
        this._username = username
        this._username_subject.next(this._username)
      }
    }
    )
  }

  get username(): string {
    return this._username
  }

  get GUEST(): string {
    return this._GUEST
  }

  /**
   * Sign user up
   * 
   * @param username 
   * @param password 
   * 
   * @return `boolean` or `string` indicating error message
   */

  async signup(username: string, password: string): Promise<boolean | string> {
    try {
      const response = await this.http.post<SimpleResponse>('/api/user/signup', { username: username, password: password }).toPromise();
      if (response.success)
        return true;
      else
        return response.error
    }
    catch (err) {
      console.error(err);
      return false;
    }
  }

  /**
   * Log user in
   * 
   * @param username 
   * @param password 
   */

  async login(username: string, password: string): Promise<boolean | string> {
    try {
      const response = await this.http.post<LoginResponse>('/api/user/login', { username: username, password: password }).toPromise();
      if (response.success) {
        if (username !== '') {
          this._username = await this.mongoService.getUsername()
          this._username_subject.next(this._username)
        }
        return true;
      }
      else
        return response.error
    }
    catch (err) {
      console.error(err);
      return false;
    }
  }

  async logout(): Promise<boolean> {
    if ((await this.http.post<SimpleResponse>('/api/user/logout', {}).toPromise()).success) {
      this._username = 'Guest'
      this._username_subject.next(this._username)
      return true
    }
  }
}
