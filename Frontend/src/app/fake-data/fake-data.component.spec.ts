import { FakeService } from './../services/fake.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FakeDataComponent } from './fake-data.component';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('FakeDataComponent', () => {
  let component: FakeDataComponent;
  let fixture: ComponentFixture<FakeDataComponent>;
  let fakeServiceMock: any;

  beforeEach(async () => {
    fakeServiceMock = {
      getDataV1: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [ FakeDataComponent ],
      providers: [
        {provide: FakeService, useValue: fakeServiceMock}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FakeDataComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should getServiceData set service data', ()=>{
    const expRes = {
      name: "xxxppp"
    };
    jest.spyOn(fakeServiceMock, 'getDataV1').mockReturnValue(of(expRes));

    fixture.detectChanges();
    expect(component.serviceData.name).toBe(expRes.name);
  });

  it('should getServiceData set error message', ()=>{
    const errorRes = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404,
      statusText: 'Not Found'
    });

    jest.spyOn(fakeServiceMock, 'getDataV1').mockReturnValue(throwError(()=>errorRes));

    component.getServiceData();
    expect(component.errorMessage).toBe('Not Found');
  });


  //to cover branch
  it('should greeting day set service data', ()=>{
    const expRes = {
      name: "xxxppp",
      time: 12
    };
    jest.spyOn(fakeServiceMock, 'getDataV1').mockReturnValue(of(expRes));

    fixture.detectChanges();
    //expect(component.serviceData.name).toBe(expRes.name);
    expect(component.greeting).toBe('Good day');
  });

  it('should greeting morning set service data', ()=>{
    const expRes = {
      name: "xxxppp",
      time: 9
    };
    jest.spyOn(fakeServiceMock, 'getDataV1').mockReturnValue(of(expRes));

    fixture.detectChanges();
    //expect(component.serviceData.name).toBe(expRes.name);
    expect(component.greeting).toBe('Good morning');
  });
});
