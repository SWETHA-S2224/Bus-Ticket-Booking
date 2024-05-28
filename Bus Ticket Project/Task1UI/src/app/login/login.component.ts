import { Component, OnInit } from '@angular/core';
import { ILogin,IAdmin } from '../i-main-table';
import { MainServiceService } from '../main-service.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { response } from 'express';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {

login:any={
   user_name:'',
   password:''
}

signup: { user_name: string, password: string } = { user_name: '', password: '' };

showPage1: boolean = false;

constructor(private service:MainServiceService,private router:Router,private messageService: MessageService){

}

  ngOnInit(): void {
    this.login.user_name='';
    this.login.password='';

  }


Signin(username:string,password:string){

  this.service.AdminLogin(username,password)
  .subscribe({
    next:(data)=>
    {
      this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Admin logged in successfully', life:2000 });
      setTimeout(()=>
      {
        this.router.navigate(['admin']);
      },500);
    },
    error:(response)=>
    {
      this.service.UserLogin(username,password)
      .subscribe({   
        next:(data)=>
        {
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'User logged in successfully', life:2000 });
          setTimeout(()=>
          {
            this.router.navigate(['main']);
          },500);
       
        },
        error:(response)=>
        {
          this.messageService.add({key:'tc', severity: 'error', summary: 'Failed to login', detail: 'User is not found',life:2000});
        }
        
      })
    }
  })
  }

  redirect(){
    this.router.navigate(['signup']);
  }



  Signup(user_name:string,password:string) {   
      this.service.NewUsers(user_name,password)
      .subscribe({
        next:(data)=>
        {
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Account created successfully', life:2000 });
          setTimeout(()=>
          {
            this.showPage1=false;
          },500);
        },
        error:(response)=>
        {
          this.messageService.add({ key: 'tc', severity: 'error', summary: 'Failed', detail: 'Failed to create an account', life:2000 });
        }
  });
}

  redirect1(){
    this.router.navigate(['']);
    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Login with your account', life:2000 });
  }


}
