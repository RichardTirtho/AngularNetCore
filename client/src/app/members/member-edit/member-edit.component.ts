import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/members';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
member:Member;
user:User;
@HostListener('window:beforeunload', ['$event']) unloadNotification($event:any){
  if(this.editForm.dirty)
  {
    $event.returnValue = true;
  }
}
  constructor(private accountService:AccountService, private memberService:MembersService,private toastr: NgToastService) { 
    this.accountService.currentUsers$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers()
  {
    this.memberService.getMember(this.user.username).subscribe(member =>{
      this.member = member;
    })
  }

  updateMember()
  {
    this.memberService.memberUpdate(this.member).subscribe(() =>{
      this.toastr.success({detail:"Success Message",summary:"Account Updated Successfully",duration:5000});
      this.editForm.reset(this.member);

    })

  }

}
