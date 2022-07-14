import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { MembersService } from 'src/app/services/members.service';
import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/models/member';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss']
})
export class MemberDetailComponent implements OnInit {
  member?: any;

  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];

  constructor(
    private membersService: MembersService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  async ngOnInit(){
    await this.loadMember();

    //setTimeout(() => {
      console.log(this.member);

      this.galleryOptions = [
        {
          width: '400px',
          height: '500px',
          imagePercent: 100,
          thumbnailsColumns: 4,
          imageAnimation: NgxGalleryAnimation.Slide,
          preview: false
        }
      ]

      //this.galleryImages = this.getImages();
    //}, 500);
  }

  getImages(): NgxGalleryImage[] {
    let imageUrls = [];
    console.log(this.member);
    if(this.member){
      for (const photo of this.member.photos) {
        imageUrls.push({
          small: photo?.url,
          medium: photo?.url,
          big: photo?.url
        })
      }
    }
    console.log(imageUrls);
    return imageUrls;
  }

  onTabActivated(data: TabDirective) {
    // this.activeTab = data;
    // if (this.activeTab.heading === 'Messages' && this.messages.length === 0) {
    //   // this.loadMessages();
    //   this.messageService.createHubConnection(this.user, this.member.username);
    // } else {
    //   this.messageService.stopHubConnection();
    // }
  }

  async loadMember(){
    const username = this.route.snapshot.paramMap.get('username');
    if(username){
      this.membersService.getMember(username).subscribe({
        next: resp => {
          console.log(resp);
          this.member = resp;
          console.log(this.member);
          this.galleryImages = this.getImages();  //get images here to avoid undefined
        },
        error: error => this.toastr.error(error)
      });
    }else{
      this.toastr.error('Cannot get the user!');
      return;
    }

  }

}
