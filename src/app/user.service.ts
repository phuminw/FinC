import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  /**
   * Sign user up
   * 
   * @param username 
   * @param password 
   */

  async signup(username: string, password: string): Promise<boolean> {
    try {
      const _ = await this.http.post('/api/user/signup', { username: username, password: password }).toPromise();
      return true;
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

  async login(username: string, password: string): Promise<boolean> {
    try {
      const _ = await this.http.post('/api/user/login', { username: username, password: password }).toPromise();
      return true;
    }
    catch (err) {
      console.error(err);
      return false;
    }
  }
}
