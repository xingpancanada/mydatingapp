import { FakeService } from './../services/fake.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fake-data',
  templateUrl: './fake-data.component.html',
  styleUrls: ['./fake-data.component.scss']
})
export class FakeDataComponent implements OnInit {
  serviceData?: any;
  errorMessage?: any;
  greeting?: any;

  constructor(
    private fakeService: FakeService
  ) { }

  ngOnInit(): void {
    this.getServiceData();
  }

  getServiceData(){
    this.fakeService.getDataV1().subscribe({
      next: data => {
        this.serviceData = data;
        this.setGreeting();
      },
      error: error => {
        this.errorMessage = error.statusText;
      },
      complete: () => {
        console.log('Finished');
      }
    })
  }

  setGreeting(){
    if(this.serviceData.time < 10){
      this.greeting = "Good morning";
    }else if(this.serviceData.time < 20){
      this.greeting = "Good day";
    }else{
      this.greeting = "Good evening";
    }
  }
}
