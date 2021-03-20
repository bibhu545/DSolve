export class LoginRequestModel {
    email: string;
    password: string;
}

export class RegisterModel {
    email: string;
    name: string;
    companyName: string;
    phone: string;
    password: string;
    confirmPassword: string;
    userType: number;
}

export class LoginResponseModel {
    isLoggedIn = false;
    userId: number;
    email: string;
    name: string;
    phone: string;
    companyName: string;
    userType: number;
    joinedOn: any;
    message: string;
}

export class UserModel {
    userId: number;
    email: string;
    name: string;
    companyName: string;
    phone: string;
    userType: number;
    joinedOn: any;
}
