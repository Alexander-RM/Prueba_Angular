import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {UserRegistrationService} from "../../../service/user-registration.service";
import {UserLoginService} from "../../../service/user-login.service";
import {CognitoCallback} from "../../../service/cognito.service";

export class NewPasswordUser {
    username?: string;
    existingPassword?: string;
    password?: string;
}
/**
 * This component is responsible for displaying and controlling
 * the registration of the user.
 */
@Component({
    selector: 'awscognito-angular2-app',
    templateUrl: './newpassword.html'
})
export class NewPasswordComponent implements CognitoCallback {
    //@ts-ignore
    registrationUser: NewPasswordUser;
    router: Router;
    errorMessage: string | null;

    constructor(public userRegistration: UserRegistrationService, public userService: UserLoginService, router: Router) {
        this.router = router;
        this.onInit();
        this.errorMessage = null;
    }

    onInit() {
        this.registrationUser = new NewPasswordUser();
        this.errorMessage = null;
    }

    ngOnInit() {
        this.errorMessage = null;
        this.userService.isAuthenticated(this);
    }

    onRegister() {
        this.errorMessage = null;
        //@ts-ignore
        this.userRegistration.newPassword(this.registrationUser, this);
    }

    cognitoCallback(message: string, result: any) {
        if (message != null) { //error
            this.errorMessage = message;
        } else { //success
            //move to the next step
            //console.log("redirecting");
            this.router.navigate(['/securehome']);
        }
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (isLoggedIn)
            this.router.navigate(['/securehome']);
    }
}
