import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.scss']
})
export class MemberMessagesComponent implements OnInit {

  @ViewChild('messageForm') messageForm?: NgForm;
  @Input() messages?: any[];
  @Input() username?: string;
  messageContent?: string;
  loading?: false;

  constructor(public messageService: MessageService){}

  ngOnInit(): void{
    //this.loadMessages();
    //console.log(this.messageService.messageThread$);
  }

  loadMessages(){
    console.log(this.username);
    this.messageService.getMessageThread(this.username!).subscribe({
      next: (resp: any) => {
        this.messages = resp;
        console.log(resp);
      },
      error: error => console.log(error)
    })
  }

  async sendMessage(){
    // (await this.messageService.sendMessage(this.username!, this.messageContent!)).subscribe((message: any) => {
    //   this.messages?.push(message);
    //   this.messageForm?.reset();
    // })

    this.messageService.sendMessage(this.username!, this.messageContent!).then(() => {
      this.messageForm?.reset();
    })
  }

}
