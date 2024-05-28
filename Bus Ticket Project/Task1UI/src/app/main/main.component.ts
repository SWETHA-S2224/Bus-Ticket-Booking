import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MainServiceService } from '../main-service.service';
import { IMainTable,ISeat,IUserTable } from '../i-main-table';
import { Router } from '@angular/router';
import { DateAdapter } from '@angular/material/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { MessageService } from 'primeng/api';
import JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  providers:[MessageService]
})
export class MainComponent implements OnInit {

  title = 'Task1UI';
  buttonDisabled = false;
  buttonDisabled1 = true;
  buttonClicked1: boolean = false; buttonClicked3: boolean = false; buttonClicked5: boolean = false; buttonClicked7: boolean = false; buttonClicked9: boolean = false; 
  buttonClicked2: boolean = false; buttonClicked4: boolean = false; buttonClicked6: boolean = false; buttonClicked8: boolean = false;buttonClicked10: boolean = false;
  buttonClicked11: boolean = false; buttonClicked13: boolean = false; buttonClicked15: boolean = false; buttonClicked17: boolean = false; buttonClicked19: boolean = false; 
  buttonClicked12: boolean = false; buttonClicked14: boolean = false; buttonClicked16: boolean = false; buttonClicked18: boolean = false;buttonClicked20: boolean = false;
  disabledButtonCount: number = 0;
  numcount:number=0;
  countArrays: number[] = [];
  genderOptions = ['Male', 'Female', 'Other'];

  countArray = Array(this.disabledButtonCount).fill(0);
  closeButtonClicked: boolean = false;

  bookbutton: boolean = true;
  selectedBoardingPoint: string = '';
  selectedDropPoint: string = '';
  TravelDate=new Date();
  clickdate=new Date();
  houses:IMainTable[]=[];
  seatPositions: ISeat[] = [];
  minDate: Date=new Date();
  maxDate: Date;
  ticketdate:any;
  ticketseat:number[]=[];
  visible3:boolean=false;
  visible4:boolean=false;

// FILTER AND LOADING
  totalRecords: number = 0;
  pageIndex: number = 0;
  pageSize: number = 5;
  loading=true;

  cost:number=0;


  main:IMainTable={
    bus_No:0,
    bus_Name:'',
    travels_Name:'',
    boarding_Point:'',
    drop_Point:'',
    ticket_Cost:0,
    seat:0
  }
  disabledSeats: any = {
    seat1: false,seat2: false,
    seat3: false,seat4: false,
    seat5: false,seat6: false,
    seat7: false,seat8: false,
    seat9: false,seat10: false,
  };

  seat:ISeat={
 
      disabledButtons:[],
      count:this.disabledButtonCount,
      bus_no:0,
      datetravel:''
  }

  addHousingRequest:IUserTable={
    user_id:undefined,
    user_name:'',
    no_of_booking:this.disabledButtonCount,
    date_of_travel:'',
    bus_no:0,
    age:0,
    gender:''
  };

  addHousing: any[] = [];
  popup:boolean=false;

  @ViewChild('barcodeRef') barcodeRef!: ElementRef<any>;

  constructor(private houseService:MainServiceService,private router:Router, private messageService: MessageService,private dateAdapter: DateAdapter<Date>){
    this.initializeUserDetails();
    console.log('addHousing length:', this.addHousing.length);
   
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
    this.maxDate = oneMonthLater;
  }
  ngOnInit(): void {
    this.houseService.getBusCount().subscribe(response=>
      {
        this.totalRecords=response;
      })
      this.refresh();
      this.checkButtonStatus();
      this.minDate = new Date();
      this.dateAdapter.setLocale('en');  

      this.generateBarcode();
  }

  check(){
    this.visible3=true;
  }
  buttonrefresh(){
    this.selectedBoardingPoint='';
    this.selectedDropPoint='';
    this.TravelDate=new Date();
    window.location.reload();
  }

  initializeUserDetails() {
    this.addHousing = Array(this.countArray.length).fill({ user_name: '', age: null, gender: ''});
  }
  insertDetails(users:any) {
    this.houseService.NewBookings(users)
      .subscribe({
        next: (response) => {
          console.log('Response:', response); 
        },
        error: (error) => {
          console.error('Error:', error); 
        }
      });
      console.log(this.seat);
      this.houseService.SeatPosition(this.seat)
      .subscribe({
        next:(seat)=>
        {
          console.log(seat);
        },
        error:(response)=>
        {
          console.log(response);
        }
      });
      this.users1=false;
      this.visible3=true;
  }

  //LAZY LOADING MAIN TABLE
  loadBusLazy(event: TableLazyLoadEvent) {
    this.pageIndex = event.first||0 ;
    this.loading=true;
    setTimeout(()=>
    {
      this.houseService.Lazyload(this.pageIndex, this.pageSize)
      .subscribe(
        (response: IMainTable[]) => {
          this.houses = response;
          this.loading=false;
          console.log(this.houses);
        }
      );
    },500);
 
  }


select(){
const date = new Date(this.TravelDate);
const month = date.getMonth() + 1;
const day = date.getDate();
const year = date.getFullYear();
const formattedDate = `${year}/${month}/${day}`;
console.log(formattedDate);
this.ticketdate=formattedDate;
  this.loadHouses();
    this.houses=[];
    this.houseService.getBusById(this.selectedBoardingPoint,this.selectedDropPoint,formattedDate)
    .subscribe({
      
      next:(houses)=>
      {
        this.houses=houses;
        console.log(houses);
   
      },
      error:(response)=>
      {
        console.log(response);
      
      }
      
    })

  }
  
visible: boolean = false;
visible1: boolean = false;
users1:boolean=false;
DateTravel:any;
bus:number=0;
ticketfare:number=0;

showDialog(bus_No:number,ticket_Cost:number) {
  this.visible=true;
  const date = new Date(this.TravelDate);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2); 
  const day = ('0' + date.getDate()).slice(-2);
  const formattedDate = `${year}-${month}-${day}`;

 this.addHousingRequest.date_of_travel=formattedDate;
 this.DateTravel=formattedDate;
 this.addHousingRequest.bus_no=bus_No;
 this.bus=bus_No;
 this.ticketfare=ticket_Cost;
 console.log(this.ticketfare);
 console.log(this.cost);

  this.resetButtonClickedStates();

  this.houseService.getAllseatposition(bus_No, formattedDate).subscribe({
    next: (seatPositions: ISeat[]) => {
      this.resetButtonClickedStates();
      seatPositions.forEach(seat => {
        if (seat.bus_no === bus_No && seat.datetravel === formattedDate) {
          seat.disabledButtons.forEach(buttonNumber => {
            switch (buttonNumber) {
              case 1:
                this.buttonClicked1 = true;
                break;
              case 2:
                this.buttonClicked2 = true;
                break;
              case 3:
                this.buttonClicked3 = true;
                break;
              case 4:
                this.buttonClicked4 = true;
                break;
              case 5:
                this.buttonClicked5 = true;
                break;
              case 6:
                this.buttonClicked6 = true;
                break;
              case 7:
                this.buttonClicked7 = true;
                break;
              case 8:
                this.buttonClicked8 = true;
                break;
              case 9:
                this.buttonClicked9 = true;
                break;
              case 10:
                this.buttonClicked10 = true;
                break; 
              case 11:
                this.buttonClicked11 = true;
                break;
              case 12:
                this.buttonClicked12 = true;
                break;
              case 13:
                this.buttonClicked13 = true;
                break;
              case 14:
                this.buttonClicked14 = true;
                break;
              case 15:
                this.buttonClicked15 = true;
                break;
              case 16:
                this.buttonClicked16 = true;
                break;
              case 17:
                this.buttonClicked17 = true;
                break;
              case 18:
                this.buttonClicked18 = true;
                break;
              case 19:
                this.buttonClicked19 = true;
                break;
              case 20:
                this.buttonClicked20 = true;
                break;
            }
          });
        }
      });
    },
    error: (error) => {
      console.error('Error loading seat positions:', error);
    }
  });
  

  this.addHousingRequest.bus_no=bus_No;
  this.seat.bus_no=bus_No;
  this.visible = true;
  this.disabledButtonCount=0;
}
showBook(){
      this.visible1 = true;
}
closeDialog() {
    this.visible = false;
}
handleButtonClick1() {
  this.ticketseat.push(1);
  this.buttonClicked1 = true;
  this.disabledButtonCount++; 
  console.log("Disabled buttons count:", this.disabledButtonCount);
}
handleButtonClick2() {
  this.ticketseat.push(2);
  this.buttonClicked2 = true;
  this.disabledButtonCount++;
  console.log("Disabled buttons count:", this.disabledButtonCount);

}
handleButtonClick3() {
  this.ticketseat.push(3);
  this.buttonClicked3 = true;
  this.disabledButtonCount++; 
  console.log("Disabled buttons count:", this.disabledButtonCount);

}
handleButtonClick4() {
  this.ticketseat.push(4);
  this.buttonClicked4 = true;
  this.disabledButtonCount++;
  console.log("Disabled buttons count:", this.disabledButtonCount);
}
handleButtonClick5() {
  this.ticketseat.push(5);
  this.buttonClicked5 = true;
  this.disabledButtonCount++; 
  console.log("Disabled buttons count:", this.disabledButtonCount);
}
handleButtonClick6() {
  this.ticketseat.push(6);
  this.buttonClicked6 = true;
  this.disabledButtonCount++;
  console.log("Disabled buttons count:", this.disabledButtonCount);
}
handleButtonClick7() {
  this.ticketseat.push(7);
  this.buttonClicked7 = true;
  this.disabledButtonCount++;
  console.log("Disabled buttons count:", this.disabledButtonCount);
}
handleButtonClick8() {
  this.ticketseat.push(8);
  this.buttonClicked8 = true;
  this.disabledButtonCount++; 
  console.log("Disabled buttons count:", this.disabledButtonCount);

}
handleButtonClick9() {
  this.ticketseat.push(9);
  this.buttonClicked9 = true;
  this.disabledButtonCount++; 
  console.log("Disabled buttons count:", this.disabledButtonCount);
}
handleButtonClick10() {
  this.ticketseat.push(10);
  this.buttonClicked10 = true;
  this.disabledButtonCount++;
  console.log("Disabled buttons count:", this.disabledButtonCount);
}
handleButtonClick11() {
  this.ticketseat.push(11);
  this.buttonClicked11 = true;
  this.disabledButtonCount++;
  console.log("Disabled buttons count:", this.disabledButtonCount);
}
handleButtonClick12() {
  this.ticketseat.push(12);
  this.buttonClicked12 = true;
  this.disabledButtonCount++;
  console.log("Disabled buttons count:", this.disabledButtonCount);
}
handleButtonClick13() {
  this.ticketseat.push(13);
  this.buttonClicked13 = true;
  this.disabledButtonCount++;
  console.log("Disabled buttons count:", this.disabledButtonCount);
}
handleButtonClick14() {
  this.ticketseat.push(14);
  this.buttonClicked14 = true;
  this.disabledButtonCount++;
  console.log("Disabled buttons count:", this.disabledButtonCount);
}
handleButtonClick15() {
  this.ticketseat.push(15);
  this.buttonClicked15 = true;
  this.disabledButtonCount++;
  console.log("Disabled buttons count:", this.disabledButtonCount);
}
handleButtonClick16() {
  this.ticketseat.push(16);
  this.buttonClicked16 = true;
  this.disabledButtonCount++;
  console.log("Disabled buttons count:", this.disabledButtonCount);
}
handleButtonClick17() {
  this.ticketseat.push(17);
  this.buttonClicked17 = true;
  this.disabledButtonCount++;
  console.log("Disabled buttons count:", this.disabledButtonCount);
}
handleButtonClick18() {
  this.ticketseat.push(18);
  this.buttonClicked18 = true;
  this.disabledButtonCount++;
  console.log("Disabled buttons count:", this.disabledButtonCount);
}
handleButtonClick19() {
  this.ticketseat.push(19);
  this.buttonClicked19 = true;
  this.disabledButtonCount++;
  console.log("Disabled buttons count:", this.disabledButtonCount);
}
handleButtonClick20() {
  this.ticketseat.push(20);
  this.buttonClicked20 = true;
  this.disabledButtonCount++;
  console.log("Disabled buttons count:", this.disabledButtonCount);
}

cancel(){
console.log(this.ticketseat);
this.ticketseat=[];
console.log(this.addHousingRequest.date_of_travel);
const date = new Date(this.TravelDate);
const year = date.getFullYear();
const month = ('0' + (date.getMonth() + 1)).slice(-2); 
const day = ('0' + date.getDate()).slice(-2);
const formattedDate = `${year}-${month}-${day}`;
console.log(formattedDate);

  this.houseService.getAllseatposition(this.addHousingRequest.bus_no, formattedDate).subscribe({
    next: (seatPositions: ISeat[]) => {
      this.resetButtonClickedStates();
      seatPositions.forEach(seat => {
        if (seat.bus_no === this.addHousingRequest.bus_no && seat.datetravel === formattedDate) {
          seat.disabledButtons.forEach(buttonNumber => {
            switch (buttonNumber) {
              case 1:
                this.buttonClicked1 = true;
                break;
              case 2:
                this.buttonClicked2 = true;
                break;
              case 3:
                this.buttonClicked3 = true;
                break;
              case 4:
                this.buttonClicked4 = true;
                break;
              case 5:
                this.buttonClicked5 = true;
                break;
              case 6:
                this.buttonClicked6 = true;
                break;
              case 7:
                this.buttonClicked7 = true;
                break;
              case 8:
                this.buttonClicked8 = true;
                break;
              case 9:
                this.buttonClicked9 = true;
                break;
              case 10:
                this.buttonClicked10 = true;
                break;
                case 11:
                this.buttonClicked11 = true;
                break;
              case 12:
                this.buttonClicked12 = true;
                break;
              case 13:
                this.buttonClicked13 = true;
                break;
              case 14:
                this.buttonClicked14 = true;
                break;
              case 15:
                this.buttonClicked15 = true;
                break;
              case 16:
                this.buttonClicked16 = true;
                break;
              case 17:
                this.buttonClicked17 = true;
                break;
              case 18:
                this.buttonClicked18 = true;
                break;
              case 19:
                this.buttonClicked19 = true;
                break;
              case 20:
                this.buttonClicked20 = true;
                break;
            }
          });
        }
      });
    },
    error: (error) => {
      console.error('Error loading seat positions:', error);
    }
  });
  this.disabledButtonCount=0;
  this.closeButtonClicked = true;
  this.buttonDisabled1=true;
}

cancel1(){
 
  const date = new Date(this.TravelDate);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2); 
  const day = ('0' + date.getDate()).slice(-2);
  const formattedDate = `${year}-${month}-${day}`;

  console.log(formattedDate);

  this.houseService.getAllseatposition(this.addHousingRequest.bus_no,formattedDate).subscribe({
    next: (seatPositions: ISeat[]) => {
      this.resetButtonClickedStates();
      seatPositions.forEach(seat => {
        if (seat.bus_no === this.addHousingRequest.bus_no && seat.datetravel === formattedDate) {
          seat.disabledButtons.forEach(buttonNumber => {
            switch (buttonNumber) {
              case 1:
                this.buttonClicked1 = true;
                break;
              case 2:
                this.buttonClicked2 = true;
                break;
              case 3:
                this.buttonClicked3 = true;
                break;
              case 4:
                this.buttonClicked4 = true;
                break;
              case 5:
                this.buttonClicked5 = true;
                break;
              case 6:
                this.buttonClicked6 = true;
                break;
              case 7:
                this.buttonClicked7 = true;
                break;
              case 8:
                this.buttonClicked8 = true;
                break;
              case 9:
                this.buttonClicked9 = true;
                break;
              case 10:
                this.buttonClicked10 = true;
                break;
                case 11:
                this.buttonClicked11 = true;
                break;
              case 12:
                this.buttonClicked12 = true;
                break;
              case 13:
                this.buttonClicked13 = true;
                break;
              case 14:
                this.buttonClicked14 = true;
                break;
              case 15:
                this.buttonClicked15 = true;
                break;
              case 16:
                this.buttonClicked16 = true;
                break;
              case 17:
                this.buttonClicked17 = true;
                break;
              case 18:
                this.buttonClicked18 = true;
                break;
              case 19:
                this.buttonClicked19 = true;
                break;
              case 20:
                this.buttonClicked20 = true;
                break;
            }
          });
        }
      });
    },
    error: (error) => {
      console.error('Error loading seat positions:', error);
    }
  });
  this.ticketseat=[];
  this.disabledButtonCount=0;
  this.closeButtonClicked = true;
  this.buttonDisabled1=true;
}

separatecount:number=0;

confirm(){

  console.log(this.addHousingRequest.date_of_travel);
  this.bookbutton = false;
  this.addHousingRequest.no_of_booking=this.disabledButtonCount;
  this.countArray = Array(this.disabledButtonCount).fill(0);
  this.addHousingRequest.date_of_travel=this.TravelDate;
  this.seat.count=this.disabledButtonCount;
  this.cost=this.ticketfare*this.disabledButtonCount;
    const disabledButtons = [];
    if (this.buttonClicked1) disabledButtons.push(1);
    if (this.buttonClicked2) disabledButtons.push(2);
    if (this.buttonClicked3) disabledButtons.push(3);
    if (this.buttonClicked4) disabledButtons.push(4);
    if (this.buttonClicked5) disabledButtons.push(5);
    if (this.buttonClicked6) disabledButtons.push(6);
    if (this.buttonClicked7) disabledButtons.push(7);
    if (this.buttonClicked8) disabledButtons.push(8);
    if (this.buttonClicked9) disabledButtons.push(9);
    if (this.buttonClicked10) disabledButtons.push(10);
    if (this.buttonClicked11) disabledButtons.push(11);
    if (this.buttonClicked12) disabledButtons.push(12);
    if (this.buttonClicked13) disabledButtons.push(13);
    if (this.buttonClicked14) disabledButtons.push(14);
    if (this.buttonClicked15) disabledButtons.push(15);
    if (this.buttonClicked16) disabledButtons.push(16);
    if (this.buttonClicked17) disabledButtons.push(17);
    if (this.buttonClicked18) disabledButtons.push(18);
    if (this.buttonClicked19) disabledButtons.push(19);
    if (this.buttonClicked20) disabledButtons.push(20);
    
    console.log('Disabled buttons:', disabledButtons);
    this.seat.disabledButtons=disabledButtons;
  const date = new Date(this.addHousingRequest.date_of_travel);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);

  // Format the date as 'YYYY-MM-DD'
  const formattedDate = `${year}-${month}-${day}`;
  this.seat.datetravel=formattedDate;

    console.log(this.seat);

    this.addHousing = this.countArray.map(() => ({
      user_name: '',
      age: null,
      gender: ''
    }));

    this.showConfirm();
    //this.visible=false;
    //this.users1=true;
}

BookConfirm(){
  
  this.messageService.add({ key:'bc', severity: 'success', summary: 'Success', detail: 'Tickets Booked Successfully',life:2000  });
  const date = new Date(this.addHousingRequest.date_of_travel);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  const formattedDate = `${year}/${month}/${day}`;
  this.seat.datetravel=formattedDate;

  const newUserTableArray:any = this.addHousing.map(user => ({
    user_id: undefined,
    user_name: user.user_name,
    no_of_booking: this.disabledButtonCount/this.disabledButtonCount,
    date_of_travel: formattedDate,
    bus_no: this.addHousingRequest.bus_no,
    age: user.age,
    gender: user.gender
  }));
  this.insertDetails(newUserTableArray);
  this.users1=false;
}


private loadHouses() {

  this.houseService.getAllBuses().subscribe({
    next: (houses) => {
      this.houses = houses;
      console.log(houses);
    },
    error: (error) => {
      console.error('Error loading houses:', error);

    }
  });
}


refresh(): void {
  const lastRefreshDate = localStorage.getItem('lastRefreshDate');
  const currentDate = new Date().toLocaleDateString();
  if (lastRefreshDate !== currentDate) {
    this.buttonDisabled = true;
    this.houseService.updateBookingStatus()
      .subscribe(
        response => {
          console.log('Booking status updated successfully');
          setTimeout(() => {
            this.buttonDisabled = false;
          }, 1000);
        },
        error => {
          console.error('Error updating booking status:', error);
          this.buttonDisabled = false;
        }
      );


    this.houseService.getAllBuses()
      .subscribe({
        next: (houses) => {
          this.houses = houses;
          console.log(houses);
        },
        error: (response) => {
          console.log(response);
        }
      });
    localStorage.setItem('lastRefreshDate', currentDate);

    setTimeout(() => {
      this.checkButtonStatus();
    }, 1000);
  }
}


checkButtonStatus(): void {

  const lastClickedDate = localStorage.getItem('lastClickedDate');
  const currentDate = new Date().toLocaleDateString();
  if (lastClickedDate === currentDate) {
    this.buttonDisabled = true;
  } else {
    this.buttonDisabled = false;
  }
}


resetButtonClickedStates(): void {
  this.buttonClicked1 = false;
  this.buttonClicked2 = false;
  this.buttonClicked3 = false;
  this.buttonClicked4 = false;
  this.buttonClicked5 = false;
  this.buttonClicked6 = false;
  this.buttonClicked7 = false;
  this.buttonClicked8 = false;
  this.buttonClicked9 = false;
  this.buttonClicked10 = false;
  this.buttonClicked11 = false;
  this.buttonClicked12 = false;
  this.buttonClicked13 = false;
  this.buttonClicked14 = false;
  this.buttonClicked15 = false;
  this.buttonClicked16 = false;
  this.buttonClicked17 = false;
  this.buttonClicked18 = false;
  this.buttonClicked19 = false;
  this.buttonClicked20 = false;
  this.ticketseat=[];
}

userdetail(){
  this.visible = true;
}

onCloseButtonClick(): void {
  this.closeButtonClicked = true;
}

showConfirm() {
  if (!this.popup) {
      this.messageService.add({ key: 'confirm', sticky: true, severity: 'success', summary: 'Click "Confirm" to proceed' });
      this.popup = true;
  }
}

onConfirm() {
  this.messageService.clear('confirm');
  this.cancel1();
  this.popup = false;
}

onReject() {
  this.messageService.clear('confirm');
  this.popup = false;
}
onconfirm1(){
  this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Your seats are confirmed',life:2000 });
  this.users1=true;
  this.messageService.clear('confirm');
  this.popup = false;
  this.visible=false;
}
logout(){
  this.router.navigate(['']);
}
output(){
  this.visible4=true;
}

download(){
  const printElement = document.getElementById('ticketprint');
  if (printElement) {
    const printContent = printElement.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  } else {
    console.error('Element with id "ticketprint" not found.');
  }
  this.visible3=false;
  window.location.reload();
}
click(){
  this.visible3=true;
}

generateBarcode(): void {
  // Combine ticket details into a single string
  const ticketDetails = `${this.selectedBoardingPoint}-${this.selectedDropPoint}-${this.ticketdate}-${this.ticketseat.join(',')}-${this.ticketfare}`;
  
  // Generate barcode
  JsBarcode(this.barcodeRef.nativeElement, ticketDetails);
}

}
