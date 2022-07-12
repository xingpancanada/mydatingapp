
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { AccountsService } from '../services/accounts.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private accountsService: AccountsService,
    private toastr: ToastrService,
    private router: Router
  ){}


  canActivate(): Observable<boolean> {
    return this.accountsService.user$.pipe(
      map((user: any) => {
        console.log(user);
        var b = false;
        if(user){
          b = true;
        }else{
          this.router.navigateByUrl('/messages');
          this.toastr.error('You are not authorized!');  //only show after logout!!! still not find reason!
        }
        return b;
      })
    );
  }

}
