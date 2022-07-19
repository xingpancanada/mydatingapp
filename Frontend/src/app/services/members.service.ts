import { map, take } from 'rxjs/operators';
import { Member } from './../models/member';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AccountsService } from './accounts.service';
import { of, Observable } from 'rxjs';

import { PaginatedResult } from '../models/pagination';
import { UserParams } from '../models/userParams';
import { IUser } from '../models/user';

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

  paginatedResult: PaginatedResult<Member[] | null> = new PaginatedResult<Member[]>();

  userParams?: UserParams | undefined;
  user?: IUser;

  memberCache = new Map();

  constructor(private http: HttpClient, private accountService: AccountsService) {
    //170. Remembering the filters for a user in the service
    this.accountService.user$.pipe(take(1)).subscribe(user => {
      if(user){
        this.user = user;
        this.userParams = new UserParams(user);  //useParams already set constructor, so we can do this here
      }
   })
  }


  getUserParams(){
    return this.userParams;
  }

  setUserParams(params: UserParams){
    this.userParams = params;
  }

  resetUserParams(){
    this.userParams = new UserParams(this.user!);
    return this.userParams;
  }


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

  //161
  getMembersWithPaging(userParams: UserParams){
    console.log(userParams);
    console.log(Object.values(userParams).join('-'));
    //168. Restoring the caching for members
    var cacheResp: any = this.memberCache.get(Object.values(userParams).join('-'));
    console.log(cacheResp);
    if(cacheResp){
      return of(cacheResp);
    }

    let params = new HttpParams();
    //if (userParams?.pageNumber !== null && userParams?.pageSize !== null && userParams?.pageNumber !== undefined && userParams?.pageSize !== undefined && userParams?.gender !== null && userParams?.gender !== undefined){
      params = params.append('pageNumber', userParams?.pageNumber.toString());
      params = params.append('pageSize', userParams?.pageSize.toString());
    //}

    params = params.append('minAge', userParams?.minAge.toString());
    params = params.append('maxAge', userParams?.maxAge.toString());
    params = params.append('gender', userParams?.gender);
    params = params.append('orderBy', userParams?.orderBy);

    return this.getPaginatedResult(this.baseUrl + 'users/memberswithpaging', params).pipe(
      map((response: any) => {
        this.memberCache.set(Object.values(userParams).join('-'), response); //just like localStorage, we needn't reload data for same query
        return response;
      })
    )
  }

  private getPaginatedResult<T>(url: string, params: any) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body!;
        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
        }
        return paginatedResult;
      })
    );
  }

  // //157
  // getMembersWithPaging(page?: number, itemsPerPage?: number){
  //   let params = new HttpParams();
  //   if (page !== null && itemsPerPage !== null && page !== undefined && itemsPerPage !== undefined){
  //     params = params.append('pageNumber', page.toString());
  //     params = params.append('pageSize', itemsPerPage.toString());
  //   }
  //   return this.http.get<Member[]>(this.baseUrl + 'users/memberswithpaging', {observe: 'response', params}).pipe(
  //     map((response: any) => {
  //       console.log('paging resp:', response);
  //       this.paginatedResult.result = response.body;
  //       if (response.headers.get('Pagination') !== null){
  //         this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
  //       }
  //       return this.paginatedResult;
  //     })
  //  )
  // }

  getMember(name: string){
    //return this.http.get<Member>(this.baseUrl + 'users/member/' + username, httpOptions);
    //return this.http.get<Member>(this.baseUrl + 'users/member/' + name);

    // console.log(name);
    // const member = this.members.find(x => x.username === name);
    // console.log(member);
    // if(member !== undefined && member !== null) return of(member);
    // return;

    //169. Restoring the caching for member details  --> get data from caching members
    //spread operator for expanded array or string
    //reduce() is to return the sum of all the elements in an array
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: Member) => member.username === name);

    if (member) {
      return of(member);
    }

    return this.http.get<Member>(this.baseUrl + 'users/member/' + name);
  }
}
