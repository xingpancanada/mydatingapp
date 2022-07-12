import { ToastrService } from 'ngx-toastr';
import { IUser } from './../models/user';
import { AccountsService } from './../services/accounts.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss']
})
export class MatchesComponent implements OnInit {
  loggedIn = false;

  //user?: IUser;

  constructor(
    private accountsService: AccountsService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  compileAndroidCode(){
    throw new Error('you are using Old Angular');
  }



  ////replace with auth guard!!!???
  getCurrentUser(){
    this.accountsService.user$.subscribe({
      next: user => {this.loggedIn = !!user},
      error: error => console.log(error)
    });
  }

}
