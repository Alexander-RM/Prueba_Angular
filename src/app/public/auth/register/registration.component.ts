import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {UserRegistrationService} from "../../../service/user-registration.service";
import {CognitoCallback} from "../../../service/cognito.service";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MaskUtilComponent } from '../../../shared/utils/mask-util-component';
import { confirmaPasswordValidator } from './validadores/confirma-password-validator.directive';
import { MessageService } from "src/app/service/message.service";
import { MediaObserver } from "@angular/flex-layout";

export class RegistrationUser {

    email?: string;
    password?: string;
    nombre?: string;
    apPaterno?: string;
    apMaterno?: string;
    compania?: string;
}
/**
 * This component is responsible for displaying and controlling
 * the registration of the user.
 */
@Component({
    selector: 'awscognito-angular2-app',
    templateUrl: './registration.html'
})
export class RegisterComponent implements CognitoCallback {
    formularioRegistro: FormGroup;
    hidePassword = true;
    hideConfirmaPassword = true;
    loading = false;
    //@ts-ignore
    registrationUser: RegistrationUser;
    router: Router;
    errorMessage: string | null | undefined;

    constructor(
        public userRegistration: UserRegistrationService,
        router: Router,
        private messageService: MessageService,
        public media: MediaObserver,
        private formBuilder: FormBuilder) {

        this.router = router;
        this.onInit();

        this.formularioRegistro = this.formBuilder.group(
            {
              nombre: [
                '',
                [
                  Validators.required,
                  this.validaText,
                  Validators.minLength(MaskUtilComponent.Size.MIN_PEOPLE_NAME_SIZE),
                  Validators.maxLength(MaskUtilComponent.Size.MAX_PEOPLE_NAME_SIZE),
                ],
              ],
              apPaterno: [
                '',
                [
                  Validators.required,
                  this.validaText,
                  Validators.minLength(MaskUtilComponent.Size.MIN_PEOPLE_LASTNAME_SIZE),
                  Validators.maxLength(MaskUtilComponent.Size.MAX_PEOPLE_LASTNAME_SIZE),
                ],
              ],
              apMaterno: [
                '',
                [
                  this.validaText,
                  Validators.maxLength(MaskUtilComponent.Size.MAX_PEOPLE_SECONDLASTNAME_SIZE),
                  Validators.minLength(MaskUtilComponent.Size.MIN_PEOPLE_SECONDLASTNAME_SIZE)
                ],
              ],
              compania: [
                '',
                [
                  this.validaText,
                  Validators.maxLength(MaskUtilComponent.Size.MAX_COMPANY_SIZE),
                  Validators.minLength(MaskUtilComponent.Size.MIN_COMPANY_SIZE)
                ],
              ],
              correo: [
                '',
                [
                  Validators.email,
                  Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/),
                  Validators.required,
                  Validators.minLength(MaskUtilComponent.Size.MIN_EMAIL_SIZE),
                  Validators.maxLength(MaskUtilComponent.Size.MAX_EMAIL_SIZE),
                ],
              ],
              password: [
                '',
                [
                  Validators.required,
                  Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\u0020¡.;¿,^`´\[\]\{\}\u0021-\u002b\u003c-\u0040])([A-Za-z\d$@$!`^%*¡?&\u0020]|[^ ]){8,}$/)//NOSONAR
                ],
              ],
              confirmaPassword: [''],
              aceptaTermino: ['', [Validators.requiredTrue]],
            },
            { validators: confirmaPasswordValidator }
          );
    }

    onInit() {
        this.registrationUser = new RegistrationUser();
    }

    onRegister() {
        this.loading = true;
        this.registrationUser.email = this.formularioRegistro.get('correo')?.value;
        this.registrationUser.password = this.formularioRegistro.get('password')?.value;
        this.registrationUser.nombre = this.formularioRegistro.get('nombre')?.value;
        this.registrationUser.apPaterno = this.formularioRegistro.get('apPaterno')?.value;
        this.registrationUser.apMaterno = this.formularioRegistro.get('apMaterno')?.value;
        this.registrationUser.compania = this.formularioRegistro.get('compania')?.value;

        this.userRegistration.register(this.registrationUser, this);
    }

    validaText(c: FormControl) {
      if(!c.value){
          return null;
      }
      const valid = !/\s\s+/g.test(c.value) && /^[-a-zA-ZÁÉÍÓÚáéíóúñÑ&]{1}[-a-zA-ZÁÉÍÓÚáéíóúñÑ& ]*$/.test(c.value);
      return valid ? null : {
        pattern: {
          valid: false
        }
      };
    }

    obtenerTerminosCondiciones(): void {
      console.log("aqui va el link de terminos");
    }

    cognitoCallback(message: string, result: any) {
        this.loading = false;
        if (message) { //error
            this.errorMessage = message;
            this.messageService.openSnackBar(this.errorMessage,'error');
        } else { //success
            //move to the next step
            //console.log("redirecting");
            this.router.navigate(['/confirmRegistration', result.user.username]);
        }
    }
}
