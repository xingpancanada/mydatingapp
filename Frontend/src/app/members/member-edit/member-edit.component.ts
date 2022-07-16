import { take } from 'rxjs/operators';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/models/member';
import { IUser } from 'src/app/models/user';
import { AccountsService } from 'src/app/services/accounts.service';
import { MembersService } from 'src/app/services/members.service';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm?: NgForm;

  member = {} as Member;
  user?: IUser;
  coverPhoto?: string;

  //119 //prevent quit browser before save changes
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any){
    if(this.editForm?.dirty){
      $event.returnValue = true;
    }
  }

  constructor(
    private accountService: AccountsService,
    private memberService: MembersService,
    private toastr: ToastrService) {
      this.accountService.user$.pipe(take(1)).subscribe({
        next: resp => {
          if(resp){
            this.user = resp;
          }
        },
        error: error => console.log(error)
      });
    }

  ngOnInit(): void {
    this.loadMember();
    //this.getCoverPhoto();
  }

  loadMember(){
    this.memberService.getMember(this.user!.username)?.subscribe({
      next: member => {this.member = member;  this.getCoverPhoto();},
      error: error => console.log(error)
    })
  }

  updateMember(){
    this.memberService.updateMember(this.member!).subscribe({
      next: resp => {
        this.toastr.success('Profile updated successfully!');
        this.editForm!.reset(this.member);  //this editForm from viewchild
      },
      error: error => console.log(error)
    })
  }

  getCoverPhoto(){
    console.log(this.member);
    if(this.member?.photos){
      this.member.photos.forEach(x => {
        if(x.isMain === true){
          this.coverPhoto = x.url;
        }
      })
    }
  }

}
