import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { SimpleResponse } from "../interface";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    if ((await this.http.post<SimpleResponse>('/api/user/logout', {}).toPromise()).success) {
      window.location.replace('/')
    }
  }

}
