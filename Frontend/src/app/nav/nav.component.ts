import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { AccountsService } from './../services/accounts.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IUser } from '../models/user';
import { Router } from '@angular/router';
import { devOnlyGuardedExpression } from '@angular/compiler';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  users: any;
  //user: any;
  model: any = {};
  loggedIn: boolean = false;
  user$?: Observable<IUser | null>;

  constructor(
    private http: HttpClient,
    private accountsService: AccountsService,
    private router: Router,
    private toastr: ToastrService
  ){}

  ngOnInit(): void {
    this.user$ = this.accountsService.user$;
    this.getCurrentUser();
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
        if(resp){
          this.loggedIn = true;
          this.router.navigateByUrl('/members');
        }
      },
      error: error => {
        console.log(error);
        this.toastr.error(error.title);
      }
    })
  }

  logout(){
    this.accountsService.logout();
    this.router.navigateByUrl('/');
    this.loggedIn = false;
  }

  getCurrentUser(){
    this.accountsService.user$.subscribe({
      next: user => {
        this.loggedIn = !!user;
        //this.user = user;
      },
      error: error => console.log(error)
    });
  }

  // authCheck(){
  //   this.getCurrentUser();
  //   if(!this.loggedIn){
  //     this.toastr.error('NOT Authorized!')
  //   }
  // }
}
