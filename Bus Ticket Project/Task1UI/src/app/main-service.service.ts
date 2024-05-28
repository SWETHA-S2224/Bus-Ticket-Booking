import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpErrorResponse } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { IBooking, IMainTable, ISeat, IUserTable, IUsers } from './i-main-table';
import { LazyLoadEvent } from 'primeng/api';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MainServiceService {
  
  getAllBus:string="http://localhost:5224/api/Main";
  selectUrl:string="http://localhost:5224/api/Main/select";
  refreshUrl:string="http://localhost:5224/api/Main/update-status";
  seat:string="http://localhost:5224/api/Main/seat";
  getseat:string="http://localhost:5224/api/Main/seatposition";
  totalbuscount:string="http://localhost:5224/api/Main/count";
  getBuses:string="http://localhost:5224/api/Main/filter?";
  adduser:string="http://localhost:5224/api/Main/user";
  userlogin:string="http://localhost:5224/api/Main/Login?";
  adminlogin:string="http://localhost:5224/api/Main/Admin?";
  NewUser:string="http://localhost:5224/api/Main/Users?";
  bookings:string="http://localhost:5224/api/Main/Booking";
  BookingsCount:string="http://localhost:5224/api/Main/Bookingcount";
  booklazyload:string="http://localhost:5224/api/Main/bookingfilter?";

  constructor(private http:HttpClient) { }
 
  getAllBuses():Observable<IMainTable[]>
  {
    return this.http.get<IMainTable[]>(this.getAllBus);
  }
  getBusById(boarding_Point:string,drop_Point:string,formattedDate:any):Observable<IMainTable[]>
  {
     return this.http.get<IMainTable[]>(this.selectUrl+"/?boarding="+boarding_Point+"&drop="+drop_Point+"&date="+formattedDate);
  }
  updateBookingStatus(): Observable<any> {
    return this.http.post<any>(this.refreshUrl, null); 
  }
  SeatPosition(seatPosition: ISeat): Observable<any> {
    console.log(seatPosition);
    return this.http.post<any>(this.seat, seatPosition);
  }
  getAllseatposition(bus_no:number,travel_date:any):Observable<ISeat[]>
  {
    console.log(bus_no,travel_date);
    return this.http.get<ISeat[]>(this.getseat+"/?bus_no="+bus_no+"&travel_date="+travel_date);
  }
  getBusCount():Observable<any>{
    return this.http.get<any>(this.totalbuscount);
  }
  Lazyload(skip:number,take:number):Observable<IMainTable[]>{
    return this.http.get<IMainTable[]>(this.getBuses+"skip="+skip+"&take="+take);
  }
  NewBookings(users: IUserTable[]): Observable<any> {
    const requestBody=users;
    console.log(requestBody);
    return this.http.post<any>(this.adduser, requestBody);
  }
  UserLogin(name:string,password:string):Observable<any>{
    return this.http.post<any>(this.userlogin+"username="+name+"&password="+password,null);
  }
  AdminLogin(name:string,password:string):Observable<any>{
    return this.http.post<any>(this.adminlogin+"username="+name+"&password="+password,null);
  }
  NewUsers(name:string,password:string):Observable<any>{
    return this.http.post<any>(this.NewUser+"user_name="+name+"&password="+password,null);
  }
  Bookings():Observable<any>
  {
    return this.http.get<any>(this.bookings);
  }
  getBookingCount():Observable<any>{
    return this.http.get<any>(this.BookingsCount);
  }
  BookingLazyload(skip:number,take:number):Observable<IBooking[]>{
    return this.http.get<IBooking[]>(this.booklazyload+"skip="+skip+"&take="+take);
  }
}
