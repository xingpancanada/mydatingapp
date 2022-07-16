import { AccountsService } from './services/accounts.service';
import { IUser } from './models/user';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Frontend';
  users: any;

  constructor(
    private accountsService: AccountsService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser(){
    const user: IUser = JSON.parse(localStorage.getItem('user')!);
    if(user){
      this.accountsService.setCurrentUser(user);
      //this.router.navigateByUrl('/members');
    }else{
      this.router.navigateByUrl('/');
    }
  }

}
