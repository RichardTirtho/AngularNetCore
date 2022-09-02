import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from '../_services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
constructor(private accountService: AccountService, private toastr:NgToastService){}

  canActivate(): Observable<boolean> {
    return this.accountService.currentUsers$.pipe(
      map(user => {
        if(user) return true;
        this.toastr.error({detail:"Error Message",summary:"You shall not pass",duration:5000})
      })
    )
  }
  
}
