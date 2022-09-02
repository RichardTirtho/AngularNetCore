import { Component,OnInit,Input, Output, EventEmitter } from "@angular/core";
import { NgToastService } from "ng-angular-popup";
import { AccountService } from "../_services/account.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
@Input() usersFromHomeComponent: any;
@Output() cancelRegister = new EventEmitter();

model: any = {};
  constructor(private accountService: AccountService, private toastr: NgToastService) { }

  ngOnInit(): void {
    console.log(this.usersFromHomeComponent);    
  }

  register()
  {
    this.accountService.register(this.model).subscribe(response => {
      console.log(response);
      this.cancel();
    },error =>{
      console.log(error);
      this.toastr.error({detail:"Error Message",summary:error.error,duration:5000});
    })
  }

  cancel()
  {
    this.cancelRegister.emit(false);
  }

}
