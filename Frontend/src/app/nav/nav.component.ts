import { MembersService } from 'src/app/services/members.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { AccountsService } from './../services/accounts.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IUser } from '../models/user';
import { Router } from '@angular/router';
import { devOnlyGuardedExpression } from '@angular/compiler';
import { Member } from '../models/member';

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

  member?: Member;
  coverPhoto?: string;

  constructor(
    private http: HttpClient,
    private accountsService: AccountsService,
    private router: Router,
    private toastr: ToastrService,
    private memberService: MembersService
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
        console.log(user);
        this.loadMember(user);
      },
      error: error => console.log(error)
    });
  }

  loadMember(user: any){
    this.memberService.getMember(user.username).subscribe({
      next: member => {
        if(member){
          this.member = member;
          this.getCoverPhoto(member);
        }
      },
      error: error => console.log(error)
    })
  }

  getCoverPhoto(member: Member){
    console.log(member);
    if(member?.photos){
      member.photos.forEach((x: any) => {
        if(x.isMain === true){
          this.coverPhoto = x.url;
        }
      })
    }
  }

  // authCheck(){
  //   this.getCurrentUser();
  //   if(!this.loggedIn){
  //     this.toastr.error('NOT Authorized!')
  //   }
  // }
}
