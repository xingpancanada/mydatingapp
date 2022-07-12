import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountsService } from '../services/accounts.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  // //because <app-register [usersFromHomeComponent]></app-register> is in home.component.html: parent to child
  @Input() usersInput: any;

  //child to parent
  @Output() cancelRegisterOutput = new EventEmitter();

  // model: any = {}
  registerForm!: FormGroup;
  maxDate: Date | undefined;
  validationErrors: string[] = [];

  constructor(private accountsService: AccountsService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router
    ){ }

  ngOnInit(): void {
    //this.toastr.success('start register');
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm(){
    // this.registerForm = new FormGroup({
    //   username: new FormControl('', Validators.required),
    //   password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]),
    //   confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')])
    // })

    this.registerForm = this.fb.group({
      //gender: ['male'],
      userName: ['', Validators.required],
      // knownAs: ['', Validators.required],
      // dateOfBirth: ['', Validators.required],
      // city: ['', Validators.required],
      // country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]],
      // password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,20}')]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    })
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl | any) => {
      return control?.value === control?.parent?.controls[matchTo].value ? null : {isMatching: true}
    }
  }

  register(){
    console.log(this.registerForm.value);
    this.accountsService.register(this.registerForm.value).subscribe({
      next: resp => {
        console.log(resp);
        //this.router.navigateByUrl('/members');
      },
      error: error => {
        // console.log(error);
        this.toastr.error(error.error);
        this.validationErrors = error;
      }
    });
  }

  cancel(){
    this.cancelRegisterOutput.emit(false);
  }

}
