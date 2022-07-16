import { take } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/models/member';
import { IUser } from 'src/app/models/user';
import { AccountsService } from 'src/app/services/accounts.service';
import { MembersService } from 'src/app/services/members.service';
import { environment } from 'src/environments/environment';
import { Photo } from 'src/app/models/photo';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.scss']
})
export class PhotoEditorComponent implements OnInit {

  @Input() member?: Member;
  uploader!: FileUploader;
  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  user?: IUser;

  constructor(private accountService: AccountsService, private memberService: MembersService) {
    this.accountService.user$.pipe(take(1)).subscribe(user => this.user = user!);
   }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any){
    this.hasBaseDropzoneOver = e;
  }

  initializeUploader(){
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',  //connect to Backend
      authToken: 'Bearer ' + this.user!.token,  //add authToken
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo: Photo = JSON.parse(response);
        this.member!.photos.push(photo);
         if (photo.isMain) {
           this.user!.photoUrl = photo.url;
           this.member!.photoUrl = photo.url;
           this.accountService.setCurrentUser(this.user!);
         }
      }
    }
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo.id).subscribe(() => {
      this.user!.photoUrl = photo.url;
      this.accountService.setCurrentUser(this.user!);
      this.member!.photoUrl = photo.url;
      this.member!.photos.forEach(p => {
        if (p.isMain) p.isMain = false;
        if (p.id === photo.id) p.isMain = true;
      })
    })
  }

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe(() => {
      this.member!.photos = this.member!.photos.filter(x => x.id !== photoId);
    })
  }


}

