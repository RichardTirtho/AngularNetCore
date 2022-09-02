import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false;
  model: any = {};
  currentUser$: Observable<User>;
  constructor(private accountService: AccountService, private router: Router, private toastr: NgToastService) { }

  ngOnInit(): void {
    this.currentUser$ = this.accountService.currentUsers$;
  }


  logIn() {
    this.accountService.login(this.model).subscribe(
      (response) => {
        this.router.navigateByUrl('/members');
      },
      error => {
        console.log(error);
        this.toastr.error({detail:"Error Message",summary:error.error,duration:5000});
      }
    );
  }


  logOut() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

 
  registerToggle()
  {
    this.registerMode = !this.registerMode;
    
  }
 

  

  cancelRegister(event: boolean)
  {
    this.registerMode = event;

  }
  


}
