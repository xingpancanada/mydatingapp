import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss']
})
export class MatchesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  compileAndroidCode(){
    throw new Error('you are using Old Angular');
  }
}
