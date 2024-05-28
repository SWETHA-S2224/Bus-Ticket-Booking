import { Component, OnInit } from '@angular/core';
import { IBooking, IMainTable, IUserTable } from '../i-main-table';
import { MainServiceService } from '../main-service.service';
import { Router } from '@angular/router';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent implements OnInit {

  Bookings:IBooking[]=[];
  totalRecords: number = 0;
  totalbusRecords:number=0;
  pageIndex: number = 0;
  pageSize: number = 5;
  loading=true;
  loading1=true;
  bus:IMainTable[]=[];

  ngOnInit(): void {
    this.service.getBookingCount().subscribe(response=>
      {
        this.totalRecords=response;
      })
      this.service.getBusCount().subscribe(response=>
        {
          this.totalbusRecords=response;
        })
  }

 constructor(private service:MainServiceService,private router:Router){

 }

 loadBookLazy(event: TableLazyLoadEvent) {
  this.pageIndex = event.first||0 ;
  this.loading=true;
  setTimeout(()=>
  {
    this.service.BookingLazyload(this.pageIndex, this.pageSize)
    .subscribe(
      (response: IBooking[]) => {
        this.Bookings = response;
        this.loading=false;
        console.log(this.Bookings);
      }
    );
  },500);

}
loadBusLazy(event: TableLazyLoadEvent) {
  this.pageIndex = event.first||0 ;
  this.loading1=true;
  setTimeout(()=>
  {
    this.service.Lazyload(this.pageIndex, this.pageSize)
    .subscribe(
      (response: IMainTable[]) => {
        this.bus = response;
        this.loading1=false;
        console.log(this.bus);
      }
    );
  },500);

}
logout(){
  setTimeout(()=>
  {
    this.router.navigate(['']);
  },1000);
}


}
