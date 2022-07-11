import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, of, ReplaySubject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.apiUrl;

  //private currentUserSource = new BehaviorSubject<IUser>(null);   //不想要一开始就返回空值
  private currentUserSource = new ReplaySubject<IUser | null>(1);  //用这个等待AUTH.GUARD返值
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  // getCurrentUserValue(){
  //   return this.currentUserSource.value;
  // }



  loadCurrentUser(){
    var token = localStorage.getItem('token');

    if(token === null){
      this.currentUserSource.next(null);
      return of(null);
    }

    ////add token to header!!!!!
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get(this.baseUrl + 'account', {headers}).pipe(
      map((user: any) => {
        if(user){
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
        return user;
      })
    );
  }

  //////////////189. Creating the account service
  login(values: any){
    return this.http.post<IUser>(this.baseUrl + 'account/login', values).pipe(
      map((user: IUser) => {
        if(user){
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

    ////////////189. Creating the account service
  register(values: any){
    return this.http.post<IUser>(this.baseUrl + 'account/register', values).pipe(
      map((user: IUser) => {
        if(user){
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  ///////189. Creating the account service
  logout(){
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }
}
