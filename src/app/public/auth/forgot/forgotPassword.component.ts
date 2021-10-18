import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {UserLoginService} from "../../../service/user-login.service";
import {CognitoCallback} from "../../../service/cognito.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from "src/app/service/message.service";
import { MediaObserver } from "@angular/flex-layout";

@Component({
    selector: 'awscognito-angular2-app',
    templateUrl: './forgotPassword.html'
})
export class ForgotPasswordStep1Component implements CognitoCallback {

    formRecuperarContrasenia: FormGroup;
    loading = false;
    errorMessage: string | null | undefined;

    constructor(public router: Router,
                public userService: UserLoginService,
                private messageService: MessageService,
                public media: MediaObserver,
                private formBuilder: FormBuilder) {

        this.formRecuperarContrasenia = this.formBuilder.group({
            correo: ['', [Validators.required, Validators.email]]
          });
    }

    onNext() {
        this.loading = true;
        this.userService.forgotPassword(this.formRecuperarContrasenia.get('correo')?.value, this);
    }

    cognitoCallback(message: string, result: any) {
        this.loading = false;
        if (message) { //error
            this.errorMessage = message;
            this.messageService.openSnackBar(this.errorMessage,'error');
        } else { //success
            this.router.navigate(['/forgotPassword', this.formRecuperarContrasenia.get('correo')?.value]);
        }
    }
}


@Component({
    selector: 'awscognito-angular2-app',
    templateUrl: './forgotPasswordStep2.html'
})
export class ForgotPassword2Component implements CognitoCallback, OnInit, OnDestroy {

    formularioNuevaContrasenia: FormGroup;
    hidePassword = true;
    email: string = '';
    private sub: any;
    loading = false;
    errorMessage: string | null | undefined;

    constructor(public router: Router, public route: ActivatedRoute,
                public userService: UserLoginService,
                private messageService: MessageService,
                public media: MediaObserver,
                private formBuilder: FormBuilder) {

        this.formularioNuevaContrasenia = this.formBuilder.group({
            password: [
            '',
                [
                    Validators.required,
                    Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\u0020¡.;¿,^`´\[\]\{\}\u0021-\u002b\u003c-\u0040])([A-Za-z\d$@$!`^%*¡?&\u0020]|[^ ]){8,}$/)//NOSONAR
                ]
            ],
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
            this.email = params['email'];
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    onNext() {
        this.loading = true;
        this.userService.confirmNewPassword(this.email, this.formularioNuevaContrasenia.get('verificationCode')?.value, this.formularioNuevaContrasenia.get('password')?.value, this);
    }

    cognitoCallback(message: string) {
        this.loading = false;
        if (message) { //error
            this.errorMessage = message;
            this.messageService.openSnackBar(this.errorMessage,'error');
        } else { //success
            this.router.navigate(['/login']);
        }
    }   
    
}