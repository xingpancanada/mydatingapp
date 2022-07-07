import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Frontend';
  users: any;

  constructor(
    private http: HttpClient
  ){}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    this.http.get('https://localhost:7213/api/users').subscribe({
      next: resp => this.users = resp,
      error: err => console.log(err)
    });
  }
}
