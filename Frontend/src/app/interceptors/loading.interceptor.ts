import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize, delay } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  needShow = true;

  constructor(
    private spinner: NgxSpinnerService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    this.needShow = true;

    setTimeout(()=>{
      if(this.needShow){
        this.spinner.show();
      }
    }, 300);

    return next.handle(request).pipe(
      //delay(1000),
      finalize(()=>{
        this.spinner.hide();
        this.needShow = false;
      })
    );
  }
}
