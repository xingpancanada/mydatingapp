import { PresenceService } from './../../services/presence.service';
import { ToastrService } from 'ngx-toastr';
import { MembersService } from 'src/app/services/members.service';
import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/models/member';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss']
})
export class MemberCardComponent implements OnInit {
  @Input() member?: Member;

  coverPhoto?: string;

  constructor(
    private membersService: MembersService,
    private toastr: ToastrService,
    public presence: PresenceService
  ) { }

  ngOnInit(): void {
    console.log(this.member);
    this.getCoverPhoto();
  }

  getCoverPhoto(){
    if(this.member?.photos){
      this.member.photos.forEach(x => {
        if(x.isMain === true){
          this.coverPhoto = x.url;
        }
      })
    }
  }

  addLike(member: Member) {
    this.membersService.addLike(member.username).subscribe({
      next: resp => this.toastr.success('You have liked ' + member.knownAs),
      error: error => this.toastr.error('You cannot liked ' + member.knownAs + ': ' + error)
    })
  }

}
