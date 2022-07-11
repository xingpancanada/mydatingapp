import { IUser } from './../models/user';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  registerMode = false;

  users: IUser[] = [];

  constructor(private http: HttpClient) { }
  //constructor() { }

  ngOnInit(): void {
    this.getUsers();
  }

  registerToggle(){
    this.registerMode = !this.registerMode;
  }

  getUsers(){
    this.http.get<IUser[]>('https://localhost:7213/api/users').subscribe({
      next: resp => this.users = resp,
      error: err => console.log(err)
    });
  }

  cancelRegisterMode(event: boolean){
    this.registerMode = event;
  }

}
