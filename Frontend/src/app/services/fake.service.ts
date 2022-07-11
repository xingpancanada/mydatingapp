import { HttpClient, HttpErrorResponse, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FakeService {

  constructor(
    private http: HttpClient
  ) { }

  postDataV1(user: any): Observable<any> {
    const url = 'https://localhost:7213/api/account/register';
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }
    return this.http.post(url, user, httpOptions);
  }

  getDataV1(): Observable<any> {
    const url = 'https://localhost:7213/api/users/1';
    return this.http.get(url);
  }

  getDataV2(): Observable<any> {
    const url = 'https://localhost:7213/api/users';
    return this.http.get(url).pipe(
      tap((data: any) => console.log('Data Fetched', data)),
      catchError(
        (error: HttpErrorResponse) => {
          return throwError(()=>error);
        }
      )
    );
  }

}
