import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule,ReactiveFormsModule} from "@angular/forms";
import {AppComponent} from "./app.component";
import {UserRegistrationService} from "./service/user-registration.service";
import {UserParametersService} from "./service/user-parameters.service";
import {UserLoginService} from "./service/user-login.service";
import {CognitoUtil} from "./service/cognito.service";
import {routing} from "./app.routes";
import {HomeComponent} from "./public/home.component";
import {AwsUtil} from "./service/aws.service";
import {SecureHomeComponent} from "./secure/landing/securehome.component";
import {JwtComponent} from "./secure/jwttokens/jwt.component";
import {LoginComponent} from "./public/auth/login/login.component";
import {RegisterComponent} from "./public/auth/register/registration.component";
import {ForgotPassword2Component, ForgotPasswordStep1Component} from "./public/auth/forgot/forgotPassword.component";
import {LogoutComponent, RegistrationConfirmationComponent} from "./public/auth/confirm/confirmRegistration.component";
import {ResendCodeComponent} from "./public/auth/resend/resendCode.component";
import {NewPasswordComponent} from "./public/auth/newpassword/newpassword.component";
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient} from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { InicioComponent } from "./public/workspace/inicio/inicio.component";
import { AplicacionesComponent } from "./public/workspace/aplicaciones/aplicaciones.component";
import { DocumentacionComponent } from "./public/workspace/documentacion/documentacion.component";
import { UtilsComponentModule } from "./public/utils-component.module";
import { MatStepperModule } from '@angular/material/stepper';
import { StepperOverviewComponent } from "./public/workspace/stepper-overview/stepper-overview.component";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MessageService } from "./service/message.service";
import { CardAppComponent } from "./public/workspace/card-app/card-app.component";
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { ApiManager } from "./network/apiManager";
import { UserSessionService } from "./service/user-session.service";
import { CanActivateGuard } from "./can-activate.guard";
import { ClipboardModule } from 'ngx-clipboard';
import { MatDialogModule } from "@angular/material/dialog";
import { EditarAppComponent } from "./public/workspace/editar-app/editar-app.component";
import { ConfirmComponent } from "./public/workspace/confirm/confirm.component";
import { PruebaComponent } from './prueba/prueba.component';

@NgModule({
  declarations: [
      NewPasswordComponent,
      LoginComponent,
      LogoutComponent,
      RegistrationConfirmationComponent,
      ResendCodeComponent,
      ForgotPasswordStep1Component,
      ForgotPassword2Component,
      RegisterComponent,
      HomeComponent,
      SecureHomeComponent,
      JwtComponent,
      AppComponent,
      InicioComponent,
      AplicacionesComponent,
      DocumentacionComponent,
      StepperOverviewComponent,
      CardAppComponent,
      EditarAppComponent,
      ConfirmComponent,
      PruebaComponent
  ],
  imports: [
      HttpClientModule,
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      BrowserAnimationsModule,
      routing,    
      FlexLayoutModule,
      MatIconModule,
      MatCardModule,
      MatFormFieldModule,
      MatInputModule,
      UtilsComponentModule,
      MatCheckboxModule,
      MatSidenavModule,
      MatToolbarModule,
      MatListModule,
      MatStepperModule,
      MatSnackBarModule,
      MatDialogModule,
      HttpClientModule,
      TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
      }),
      MatProgressSpinnerModule,
      NgxChartsModule,
      ClipboardModule
  ],
  providers: [
      CognitoUtil,
      AwsUtil,
      UserRegistrationService,
      UserLoginService,
      UserParametersService,
      MatIconRegistry,
      MessageService,
      ApiManager,
      UserSessionService,
      CanActivateGuard
    ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
