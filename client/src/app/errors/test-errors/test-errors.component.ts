import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-errors',
  templateUrl: './test-errors.component.html',
  styleUrls: ['./test-errors.component.css']
})
export class TestErrorsComponent implements OnInit {
baseUrl= 'https://localhost:5001/api/';
validationError: string[] =[];
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  get401Error()
  {
    this.http.get(this.baseUrl + 'buggy/auth').subscribe(respose =>{
      console.log(respose);
    },err =>{
      console.log(err);
    })
  }


  get404Error()
  {
    this.http.get(this.baseUrl + 'buggy/not-found').subscribe(respose =>{
      console.log(respose);
    },err =>{
      console.log(err);
    })
  }
 

  get400Error()
  {
    this.http.get(this.baseUrl + 'buggy/bad-request').subscribe(respose =>{
      console.log(respose);
    },err =>{
      console.log(err);
    })
  }

  get400ValidationError()
  {
    this.http.post(this.baseUrl + 'account/register',{}).subscribe(response =>{
      console.log(response);
    },error => {
      console.log(error);
      this.validationError = error;
    })
  }

  get500Error()
  {
    this.http.get(this.baseUrl + 'buggy/server-error').subscribe(respose =>{
      console.log(respose);
    },err =>{
      console.log(err);
    })
  }

}
