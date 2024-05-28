export interface IMainTable {
    bus_No:number,
    bus_Name:string,
    travels_Name:string,
    boarding_Point:string,
    drop_Point:string,
    ticket_Cost:number,
    seat:number
}


export interface IUserTable {
    user_id:number | undefined,
    user_name:any,
    no_of_booking:number,
    date_of_travel:Date | any,
    bus_no:number,
    age:number,
    gender:string
}

export interface ISeat{
    disabledButtons: number[];
    count: number;
    bus_no: number;
    datetravel:string | any
}

export interface LazyEvent {
    first: number;
    last: number;
}

export interface Users{
    user_name:string,
    age:number,
    gender:string,
    password:string
}

export interface ILogin{
    user_name:string,
    password:string
}

export interface IAdmin{
    user_name:string,
    password:string
}

export interface IUsers{
    user_name:string,
    password:string
}

export interface IBooking{
    user_id:number,
    user_name:any,
    no_of_booking:number,
    date_of_travel:Date | any,
    status:string,
    bus_no:number,
    age:number,
    gender:string,
    bus_Name:string,
    travels_Name:string,
    boarding_Point:string,
    drop_Point:string,
    ticket_Cost:number
}