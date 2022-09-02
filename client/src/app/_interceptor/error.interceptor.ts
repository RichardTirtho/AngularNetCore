import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { catchError } from 'rxjs/operators';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router:Router, private toastr: NgToastService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error =>{
        if(error)
        {
          switch(error.status)
          {
            case 400:
              if(error.error.errors)
              {
                const modalStateErrors = [];
                for(const key in error.error.errors)
                {
                  if(error.error.errors[key])
                  {
                    modalStateErrors.push(error.error.errors[key])
                  }
                }
                throw modalStateErrors.flat();
              }else{
                this.toastr.error({detail:error.statusText,summary:error.status,duration:5000})
              }
              break;
              case 401:
                this.toastr.error({detail:error.statusText,summary:error.status,duration:5000})
                break;
              case 404:
                this.router.navigateByUrl('/not-found');
                break;
              case 500:
                const navigationExtras: NavigationExtras={state:{error:error.error}}
                this.router.navigateByUrl('/server-error',navigationExtras);
              default:
                this.toastr.error({detail:"Something Unexpected went wrong",summary:error.status,duration:5000})
                console.log(error);
                break;

          }

        }
        return throwError(error);
      })
    );
  }
}
