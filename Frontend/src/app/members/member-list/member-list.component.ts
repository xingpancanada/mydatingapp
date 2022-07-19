import { UserParams } from './../../models/userParams';
import { Observable } from 'rxjs';
import { Member } from './../../models/member';
import { Component, OnInit } from '@angular/core';
import { MembersService } from 'src/app/services/members.service';
import { Pagination } from 'src/app/models/pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
  members$?: Observable<Member[]>;

  members?: Member[];
  pagination?: Pagination;
  // pageNumber = 1;
  // pageSize = 6;

  userParams!: UserParams;

  genderList = [
    {value:'male', display:'Males'},
    {value:'female', display:'Females'}
  ];

  constructor(
    private membersService: MembersService
  ) {
    //170. Remembering the filters for a user in the service
    this.userParams = this.membersService.getUserParams()!;
  }

  ngOnInit(): void {
    this.loadMembers();
    //this.members$ = this.membersService.getMembers();  //now, it will not reload every time
  }

  resetFilters(){
    // this.userParams = new UserParams(this.user);
    this.userParams = this.membersService.resetUserParams();

    this.loadMembers();
  }

  pageChanged(event: any){
    console.log('pagechanged event:', event);
    // this.pageNumber = event.page;
    this.userParams!.pageNumber = event.page;
    this.membersService.setUserParams(this.userParams!);
    this.loadMembers();
  }

  // loadMembers(){
  //   this.membersService.getMembers().subscribe(members => {
  //     this.members = members;
  //   })
  // }

  // loadMembers(){
  //   this.membersService.getMembersWithPaging(this.pageNumber, this.pageSize).subscribe((response: any) => {
  //     this.members = response.result;
  //     this.pagination = response.pagination;
  //     console.log(this.members);
  //   })
  // }

  //161
  loadMembers(){
    //170. Remembering the filters for a user in the service
    this.membersService.setUserParams(this.userParams);
    console.log(this.userParams);

    this.membersService.getMembersWithPaging(this.userParams).subscribe((response: any) => {
      if(response && response.result){
        this.members = response.result;
        this.pagination = response.pagination;
      }
    })
  }

}
