import { PresenceService } from './presence.service';
import { IUser } from './../models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  baseUrl = environment.apiUrl;
  private userBS = new ReplaySubject<IUser | null>(1);
  user$ = this.userBS.asObservable();

  constructor(
    private http: HttpClient,
    private presence: PresenceService
  ) { }

  register(model: any){
    return this.http.post<IUser>(this.baseUrl + 'account/register', model).pipe(
      map((resp: IUser)=> {
        const user = resp;
        console.log(user);
        if(user){
          this.setCurrentUser(user);
          //224
          this.presence.createHubConnection(user);
        }
        return user;  //if no this return, subscribe would be undefine!!!
      })
    )
  }

  login(model: any){
    return this.http.post<IUser>(this.baseUrl + 'account/login', model).pipe(
      tap(
        (resp: any) => console.log(resp)
      ),
      map((resp: IUser) => {
        const user = resp;
        if(user){
          console.log(user);
          this.setCurrentUser(user);
           //224
           this.presence.createHubConnection(user);
        }
        return user;
      })
    )
  }

  setCurrentUser(user: IUser){
    //214
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);

    localStorage.setItem('user', JSON.stringify(user));
    this.userBS.next(user);
  }

  logout(){
    localStorage.removeItem('user');
    this.userBS.next(null);
     //224
     this.presence!.stopHubConnection();
  }

  //214
  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
