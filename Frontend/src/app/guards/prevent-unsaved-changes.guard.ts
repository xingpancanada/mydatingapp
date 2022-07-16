import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<unknown> {

  //119 //prevent going to another page or going back before saved changes

  canDeactivate(component: MemberEditComponent): boolean {
    if(component.editForm?.dirty){
      return confirm('Are you sure you want to continue? Any unsaved changes will be lost!')  //browser pops out the choices
    }
    return true;
  }

}
