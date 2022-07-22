import { ErrorComponent } from './errors/error/error.component';
import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { MatchesComponent } from './matches/matches.component';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { PreventUnsavedChangesGuard } from './guards/prevent-unsaved-changes.guard';
import { MemberDetailedResolver } from './resolvers/member-detailed.resolver';


const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'error', component: ErrorComponent},
  {path:'test-error', component: TestErrorComponent},
  {path:'server-error', component: ServerErrorComponent},
  {path:'not-found', component: NotFoundComponent},
  {path:'matches', component: MatchesComponent},
  {path:'members', component: MemberListComponent},
  {path:'members/:username', component: MemberDetailComponent, resolve: {member: MemberDetailedResolver}},
  {path:'member/edit', component: MemberEditComponent, canDeactivate: [PreventUnsavedChangesGuard]},
  //{path:'member/edit', component: MemberEditComponent},
  {path:'lists', component: ListsComponent},
  {path:'messages', component: MessagesComponent},
  //{path:'account', loadChildren: () => import('./account/account.module').then(mod => mod.AccountModule)}, //lazy loading
  {path:'**', redirectTo: 'not-found', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
