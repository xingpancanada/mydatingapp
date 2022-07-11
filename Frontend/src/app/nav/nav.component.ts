import { Observable } from 'rxjs';
import { AccountsService } from './../services/accounts.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ThisReceiver } from '@angular/compiler';
import { IUser } from '../models/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  users: any;
  user: any;
  model: any = {};
  loggedIn: boolean = false;
  user$?: Observable<IUser | null>;

  constructor(
    private http: HttpClient,
    private accountsService: AccountsService
  ){}

  ngOnInit(): void {
    this.user$ = this.accountsService.user$;
    //this.getCurrentUser();
    //this.getUsers();
  }

  // getUsers(){
  //   this.http.get('https://localhost:7213/api/users').subscribe({
  //     next: resp => this.users = resp,
  //     error: err => console.log(err)
  //   });
  // }

  login(){
    this.accountsService.login(this.model).subscribe({
      next: resp => {
        console.log(resp);
        this.user = resp;
        this.loggedIn = true;
      },
      error: err => console.log(err)
    })
  }

  logout(){
    this.accountsService.logout();
    this.loggedIn = false;
  }

  // getCurrentUser(){
  //   this.accountsService.user$.subscribe({
  //     next: user => this.loggedIn = !!user,
  //     error: error => console.log(error)
  //   });
  // }
}
