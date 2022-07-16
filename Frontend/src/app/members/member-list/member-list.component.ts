import { Observable } from 'rxjs';
import { Member } from './../../models/member';
import { Component, OnInit } from '@angular/core';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
  //members?: Member[];
  members$?: Observable<Member[]>;

  constructor(private membersService: MembersService) { }

  ngOnInit(): void {
    //this.loadMembers();
    this.members$ = this.membersService.getMembers();  //now, it will not reload every time
  }

  // loadMembers(){
  //   this.membersService.getMembers().subscribe(members => {
  //     this.members = members;
  //   })
  // }

}
