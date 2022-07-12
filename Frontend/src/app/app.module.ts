import { MatInputModule } from '@angular/material/input';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TestDirective } from './test.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { MatchesComponent } from './matches/matches.component';
import { FakeDataComponent } from './fake-data/fake-data.component';
import { AsynchronousComponent } from './asynchronous/asynchronous.component';
import { NavComponent } from './nav/nav.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ErrorComponent } from './errors/error/error.component';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    MatchesComponent,
    FakeDataComponent,
    AsynchronousComponent,
    NavComponent,
    TestDirective,
    HomeComponent,
    RegisterComponent,
    ListsComponent,
    MessagesComponent,
    MemberDetailComponent,
    MemberListComponent,
    ErrorComponent,
    TestErrorComponent,
    ServerErrorComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS,useClass: ErrorInterceptor,multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
