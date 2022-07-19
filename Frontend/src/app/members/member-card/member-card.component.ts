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

  constructor() { }

  ngOnInit(): void {
    //console.log(this.member);
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
    // this.memberService.addLike(member.username).subscribe(() => {
    //   this.toastr.success('You have liked ' + member.knownAs);
    // })
  }

}
