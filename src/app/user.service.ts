/**
 * Service for user data manipulation
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SimpleResponse, LoginResponse } from "./interface";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // username: string

  constructor(private http: HttpClient) { }

  /**
   * Sign user up
   * 
   * @param username 
   * @param password 
   * 
   * @return `boolean` or `string` indicating error message
   */

  async signup(username: string, password: string): Promise<boolean|string> {
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

  async login(username: string, password: string): Promise<boolean|string> {
    try {
      const response = await this.http.post<LoginResponse>('/api/user/login', { username: username, password: password }).toPromise();
      if (response.success) {
        // this.username = response.username
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
}
