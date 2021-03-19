import Swal from 'sweetalert2';

// export const BaseUrl = 'https://herokuapis.herokuapp.com';
export const BaseUrl = 'http://localhost:5000';

export const API_ENDPOINTS = {
    login: BaseUrl + '/api/dsolve/user/login',
    register: BaseUrl + '/api/dsolve/user/register'
};

export const USER_TYPES = {
    admin: 0,
    operator: 1
};

export class Utils {

    constructor() {

    }

    showErrorMessage(message: string, footerMessage?: string): void {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: message,
            footer: footerMessage
        });
    }
    showSuccessMessage(message: string): void {
        Swal.fire(
            message,
            'Your file has been deleted.',
            'success'
        );
    }

    showConfirm(message: string, confirmBtnText: string): any {
        return Swal.fire({
            title: 'Are you sure?',
            text: message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: confirmBtnText
        });
    }

    showServerError(error: any): void {
        this.showErrorMessage('Some internal error occured. ' + error.message);
    }
}
