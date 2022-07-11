import { AccountsService } from './services/accounts.service';
import { IUser } from './models/user';
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
    private accountsService: AccountsService
  ){}

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser(){
    const user: IUser = JSON.parse(localStorage.getItem('user')!);
    this.accountsService.setCurrentUser(user);
  }

}
