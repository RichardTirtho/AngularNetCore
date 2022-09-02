import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/members';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {2
  members$:Observable<Member[]>;

  constructor(private memberService:MembersService) { }

  ngOnInit(): void {
   this.members$ = this.memberService.getMembers();
  }


}