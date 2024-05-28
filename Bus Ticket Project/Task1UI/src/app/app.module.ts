import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardModule } from 'primeng/card';
import { MenubarModule } from 'primeng/menubar';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import { TableModule } from 'primeng/table';
import {FormsModule} from '@angular/forms';
import { HttpClientModule,withFetch, provideHttpClient} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainServiceService } from './main-service.service';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import {MatCardModule} from '@angular/material/card';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import {RadioButtonModule} from 'primeng/radiobutton';
import {PaginatorModule} from 'primeng/paginator';
import { DividerModule } from 'primeng/divider';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    AdminLoginComponent
  ],
  
  imports: [
    BrowserModule,
    AppRoutingModule,
    CardModule,
    MenubarModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    TableModule,
    FormsModule,HttpClientModule,BrowserAnimationsModule,ToastModule,DialogModule,ButtonModule,TooltipModule,MatCardModule,CalendarModule,AutoCompleteModule,PaginatorModule,
    DividerModule,
    RadioButtonModule
  ],
  providers: [
    provideHttpClient(withFetch()),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    MainServiceService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
