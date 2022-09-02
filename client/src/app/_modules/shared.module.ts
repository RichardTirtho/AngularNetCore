import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgToastModule } from 'ng-angular-popup/lib/ng-toast.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {TabsModule} from 'ngx-bootstrap/tabs';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    NgToastModule,
    TabsModule.forRoot(),
    NgxGalleryModule 
  ],
  exports:[
    BsDropdownModule,
    NgToastModule,
    TabsModule,
    NgxGalleryModule

  ]
})
export class SharedModule { }
