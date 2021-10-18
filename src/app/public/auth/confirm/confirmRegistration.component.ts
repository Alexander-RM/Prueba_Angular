import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {UserRegistrationService} from "../../../service/user-registration.service";
import {UserLoginService} from "../../../service/user-login.service";
import {LoggedInCallback} from "../../../service/cognito.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MessageService } from "src/app/service/message.service";
import { MediaObserver } from "@angular/flex-layout";
import { UserSessionService } from "src/app/service/user-session.service";

@Component({
    selector: 'awscognito-angular2-app',
    template: ''
})
export class LogoutComponent implements LoggedInCallback {

    constructor(public router: Router,
                public userService: UserLoginService,
                private userSessionService: UserSessionService) {
        this.userService.isAuthenticated(this)
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (isLoggedIn) {
            this.userSessionService.setUserSession({});
            this.userSessionService.setToken('');
            this.userService.logout();
            this.router.navigate(['/login']);
        }

        this.router.navigate(['/login']);
    }
}

@Component({
    selector: 'awscognito-angular2-app',
    templateUrl: './confirmRegistration.html'
})
export class RegistrationConfirmationComponent implements OnInit, OnDestroy {
    confirmationCode: string = '';
    email: string = '';
    private sub: any;
    formularioConfirmaRegistro: FormGroup;
    loading = false;
    errorMessage: string | null | undefined;

    constructor(
        public regService: UserRegistrationService,
        public router: Router,
        public route: ActivatedRoute,
        private messageService: MessageService,
        private formBuilder: FormBuilder,
        public media: MediaObserver) {

            this.formularioConfirmaRegistro = this.formBuilder.group({
                verificationCode: [
                '',
                    [
                        Validators.required
                    ]
                ]
                }
            );
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.email = params['username'];
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    onConfirmRegistration() {
        this.loading = true;
        this.regService.confirmRegistration(this.email, this.formularioConfirmaRegistro.get('verificationCode')?.value, this);
    }

    cognitoCallback(message: string, result: any) {
        this.loading = false;
        if (message) { //error
            this.errorMessage = message;
            this.messageService.openSnackBar(this.errorMessage,'error');
        } else { //success
          this.router.navigate(['/home']);
        }
    }
}





