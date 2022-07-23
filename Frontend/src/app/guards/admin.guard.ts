import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountsService } from '../services/accounts.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private accountService: AccountsService, private toastr: ToastrService){}

  canActivate(): Observable<boolean> {
    return this.accountService.user$.pipe(
      map(user => {
        if(user?.roles.includes('Admin') || user?.roles.includes('Moderator')){
          return true;
        }else{
          this.toastr.error('You cannot enter this area!');
          return false;
        }
      })
    )
  }

}
