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
    userId: string;
    email: string;
    name: string;
    companyName: string;
    phone: string;
    userType: number;
    joinedOn: any;
}

export class CheckedModel {
    checkId: string;
    date: string;
    dateString: string;
    totalChecked: number;
    userId: string;
    deptId: string;
    deptName: string;
    amount: number;
}

export class DefectDataModel {
    checked: string;
    defect: string;
    defectName: string;
    amount: number;
    user: string;
}

export class DefectModel {
    name: string;
    deptId: string;
    solution: string;
    defectId: string;
    editMode?: boolean;
}

export class CompleteDataModel {
    checkedData: CheckedModel;
    defectData: DefectDataModel[];
    total: number;
}

export class ViewDataModel {
    fromDate: Date;
    toDate: Date;
    deptId: string;
    userId: string;
}

export class ViewDataResponseModel {
    date: Date;
    dateString: string;
}

export class DDLModel {
    text: string;
    value: string;

    constructor(text: string, value: string) {
        this.text = text;
        this.value = value;
    }
}
