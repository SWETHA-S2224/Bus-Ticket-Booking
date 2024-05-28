import { Component, OnInit } from '@angular/core';
import { MainServiceService } from './main-service.service';
import { MessageService } from 'primeng/api';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers:[MessageService]
})
export class AppComponent implements OnInit{

    constructor(private houseService:MainServiceService,private messageService: MessageService){

  }
  ngOnInit(): void {
  }
 
}

  


