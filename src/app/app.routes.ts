import {RouterModule, Routes} from "@angular/router";
import {ModuleWithProviders} from "@angular/core";
import {HomeComponent} from "./public/home.component";
import {LoginComponent} from "./public/auth/login/login.component";
import {RegisterComponent} from "./public/auth/register/registration.component";
import {ForgotPassword2Component, ForgotPasswordStep1Component} from "./public/auth/forgot/forgotPassword.component";
import {LogoutComponent, RegistrationConfirmationComponent} from "./public/auth/confirm/confirmRegistration.component";
import {ResendCodeComponent} from "./public/auth/resend/resendCode.component";
import {NewPasswordComponent} from "./public/auth/newpassword/newpassword.component";
import { InicioComponent } from "./public/workspace/inicio/inicio.component";
import { AplicacionesComponent } from "./public/workspace/aplicaciones/aplicaciones.component";
import { DocumentacionComponent } from "./public/workspace/documentacion/documentacion.component";
import { CanActivateGuard } from "./can-activate.guard";

const homeRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent, 
        pathMatch: 'full'
    },
    {
        path: 'register',
        component: RegisterComponent, 
        pathMatch: 'full'
    },
    {
        path: 'forgotPassword',
        component: ForgotPasswordStep1Component, 
        pathMatch: 'full'
    },
    {
        path: 'forgotPassword/:email',
        component: ForgotPassword2Component, 
        pathMatch: 'full'
    },
    {
        path: 'confirmRegistration/:username',
        component: RegistrationConfirmationComponent, 
        pathMatch: 'full'
    },
    {
        path: 'resendCode',
        component: ResendCodeComponent, 
        pathMatch: 'full'
    },
    {
        path: 'newPassword',
        component: NewPasswordComponent, 
        pathMatch: 'full'
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    }, 
    {
        path: 'home',
        component: HomeComponent,
        children: [
            {path: 'inicio', component: InicioComponent, canActivate: [CanActivateGuard] },
            {path: 'aplicaciones', component: AplicacionesComponent, canActivate: [CanActivateGuard]},
            {path: 'documentacion', component: DocumentacionComponent, canActivate: [CanActivateGuard]},
            {path: 'logout', component: LogoutComponent}
        ]
    },

];

const routes: Routes = [
    {
        path: '',
        children: [
            ...homeRoutes,
            {
                path: '',
                component: HomeComponent
            }
        ]
    },


];

export const appRoutingProviders: any[] = [];

//@ts-ignore
export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
