import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.scss']
})
export class TestErrorComponent implements OnInit {

  baseUrl = environment.apiUrl;
  validationErrors: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  get404Error(){
    this.http.get(this.baseUrl + 'buggy/not-found').subscribe(resp=>{
      console.log(resp);
    });
  }

  get500Error(){
    this.http.get(this.baseUrl + 'buggy/server-error').subscribe(resp=>{
      console.log(resp);
    });
  }

  get400Error(){
    this.http.get(this.baseUrl + 'buggy/bad-request').subscribe(resp=>{
      console.log(resp);
    });
  }

  get400ValidationError(){
    this.http.get(this.baseUrl + 'users/42').subscribe(resp=>{
      console.log(resp);
    });
  }

}
