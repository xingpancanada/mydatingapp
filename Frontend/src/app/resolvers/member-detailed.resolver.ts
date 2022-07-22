import { MembersService } from 'src/app/services/members.service';
import { Member } from 'src/app/models/member';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class MemberDetailedResolver implements Resolve<Member> {

    constructor(private memberService: MembersService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Member> {
      return this.memberService.getMember(route.paramMap.get('username')!);
    }

}
