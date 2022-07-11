import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-asynchronous',
  templateUrl: './asynchronous.component.html',
  styleUrls: ['./asynchronous.component.scss']
})
export class AsynchronousComponent implements OnInit {
  timeoutResp: string = 'test';

  constructor() { }

  ngOnInit(): void {
  }

  checkSetTimeout(){
    setTimeout(()=>{
      console.log('Inside setTimeout');
      this.timeoutResp = "setTimeoutCheck";
    }, 1000);
  }
}
