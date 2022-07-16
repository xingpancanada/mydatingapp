import { Member } from './../models/member';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccountsService } from './accounts.service';
import { map, of, Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')!)?.token
  })
}

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;

  members: Member[] = [];

  constructor(private http: HttpClient, private accountService: AccountsService) { }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});  //put need send object in body or set it empty
  }

  updateMember(member: Member){
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    )
  }


  getMembers(){
    //return this.http.get<Member[]>(this.baseUrl + 'users/members', httpOptions);
    //return this.http.get<Member[]>(this.baseUrl + 'users/members');  //after created jwt.interceptor.ts 109

    //123. Using the service to store state --> return observable members: of(this.members) or members from map()
    if(this.members.length > 0) return of(this.members);
    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      map(members => {
        this.members = members;
        return members;
      })
    )
  }

  getMember(name: string){
    //return this.http.get<Member>(this.baseUrl + 'users/member/' + username, httpOptions);
    return this.http.get<Member>(this.baseUrl + 'users/member/' + name);

    // console.log(name);
    // const member = this.members.find(x => x.username === name);
    // console.log(member);
    // if(member !== undefined && member !== null) return of(member);
    // return;

    // //spread operator for expanded array or string
    // const member = [...this.memberCache.values()]
    //   .reduce((arr, elem) => arr.concat(elem.result), [])
    //   .find((member: Member) => member.username === username);

    // if (member) {
    //   return of(member);
    // }

    // return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }
}
