import Swal from 'sweetalert2';

export const BaseUrl = 'https://herokuapis.herokuapp.com';
// export const BaseUrl = 'http://localhost:5000';

export const API_ENDPOINTS = {
    login: BaseUrl + '/api/dsolve/user/login',
    register: BaseUrl + '/api/dsolve/user/register',
    viewProfile: BaseUrl + '/api/dsolve/user/view-profile',
    editProfile: BaseUrl + '/api/dsolve/user/edit-profile',
    getDepartments: BaseUrl + '/api/dsolve/operations/get-department',
    getDefects: BaseUrl + '/api/dsolve/operations/get-defects',
    addDHU: BaseUrl + '/api/dsolve/operations/add-dhu',
    addDefect: BaseUrl + '/api/dsolve/operations/add-defects',
    deleteDefect: BaseUrl + '/api/dsolve/operations/delete-defect',
    addDefectData: BaseUrl + '/api/dsolve/operations/add-defectdata',
    deleteDefectData: BaseUrl + '/api/dsolve/operations/delete-defect-data',
    updateDefectData: BaseUrl + '/api/dsolve/operations/update-defect-data',
    getDefectData: BaseUrl + '/api/dsolve/operations/get-defectdata',
    getDHUByDate: BaseUrl + '/api/dsolve/operations/get-dhu-bydate',
    getDefectDataByCheckedIds: BaseUrl + '/api/dsolve/operations/get-defectdata-bychecked-ids',
    getSolutions: BaseUrl + '/api/dsolve/operations/get-solutions',
    deleteDHU: BaseUrl + '/api/dsolve/operations/delete-dhu'
};

export const USER_TYPES = {
    admin: 0,
    operator: 1,
    Others: 2
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
            'Your data has been updated.',
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
