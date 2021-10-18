import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserLoginService } from "../../../service/user-login.service";
import { ChallengeParameters, CognitoCallback, LoggedInCallback } from "../../../service/cognito.service";
import { Validators, FormBuilder, FormGroup  } from '@angular/forms';
import { MessageService } from "src/app/service/message.service";
import { MediaObserver } from "@angular/flex-layout";
import { UserSessionService } from "src/app/service/user-session.service";

@Component({
    selector: 'awscognito-angular2-app',
    templateUrl: './login.html'
})
export class LoginComponent implements CognitoCallback, LoggedInCallback, OnInit {
    formularioAcceso: FormGroup;
    loading = false;
    hidePassword = true;
    errorAcceso = false;
     //@ts-ignore
    errorMessage: string | null;
    mfaStep = false;
    mfaData = {
        destination: '',
        callback: null
    };

    constructor(public router: Router,
                private formBuilder: FormBuilder,
                public userService: UserLoginService,
                public media: MediaObserver,
                private messageService: MessageService,
                private userSessionService: UserSessionService) {
        this.formularioAcceso = this.formBuilder.group({
            correo: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
        });
    }

    ngOnInit() {
        this.errorMessage = null;
        this.userService.isAuthenticated(this);
    }

    onLogin() {
        this.loading = true;
        this.userSessionService.setToken('');
        this.userSessionService.setUserSession({});
        this.userService.authenticate(this.formularioAcceso.get('correo')?.value, this.formularioAcceso.get('password')?.value, this);
    }

    cognitoCallback(message: string, session: any) {
        this.loading = false;
        if (message) { //error
            this.errorMessage = message;
            if (this.errorMessage === 'User is not confirmed.') {
                this.router.navigate(['/confirmRegistration', this.formularioAcceso.get('correo')?.value]);
            } else if (this.errorMessage === 'User needs to set password.') {
                this.router.navigate(['/newPassword']);
            }else{
                this.messageService.openSnackBar(this.errorMessage,'error');
            }
        } else { //success
            this.userSessionService.setToken(session.getAccessToken().getJwtToken());
            this.router.navigate(['/home']);
        }
    }

    handleMFAStep(challengeName: string, challengeParameters: ChallengeParameters, callback: (confirmationCode: string) => any): void {
        this.mfaStep = true;
        this.mfaData.destination = challengeParameters.CODE_DELIVERY_DESTINATION;
         //@ts-ignore
        this.mfaData.callback = (code: string) => {
            if (code == null || code.length === 0) {
                this.errorMessage = "Code is required";
                return;
            }
            this.errorMessage = null;
            callback(code);
        };
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (isLoggedIn) {
            this.router.navigate(['/home']);
        }
    }

    cancelMFA(): boolean {
        this.mfaStep = false;
        return false;   //necessary to prevent href navigation
    }
}
