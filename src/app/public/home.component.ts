import {Component, OnInit} from "@angular/core";
import { Router } from "@angular/router";
import {CognitoUtil, LoggedInCallback } from "../service/cognito.service";
import { UserLoginService } from "../service/user-login.service";
import { UserParametersService } from "../service/user-parameters.service";
import {ApiManager} from "../network/apiManager";
import {MessageService} from "../service/message.service";
import { UserSessionService } from "../service/user-session.service";

declare let AWS: any;
declare let AWSCognito: any;
@Component({
    selector: 'awscognito-angular2-app',
    templateUrl: './home.html'
})
export class HomeComponent implements OnInit, LoggedInCallback {

    user: any = {};
    loading = false;

    constructor(
        public userService: UserLoginService,
        public router: Router,
        public userParametersService: UserParametersService,
        private messageService: MessageService,
        public  apiManager: ApiManager,
        public cognitoUtil: CognitoUtil,
        private userSessionService: UserSessionService) {
    }

    ngOnInit() {
        this.userService.isAuthenticated(this);
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
      if (!isLoggedIn) {
        this.router.navigate(["/login"]);
      }else{
        this.loading = true;
        if(this.router.url == '/home'){
            this.userSessionService.loadUserData().then(res => {
                this.user = this.userSessionService.getUserSession();
                this.loading = false;
                this.router.navigate(['/home/inicio']);
            },error => {
                this.loading = false;
                this.messageService.openSnackBar("Error al recuperar la información de usuario",'error');
            });
        }else{
            this.loading = false;
            this.user = this.userSessionService.getUserSession();
        }
      }
    }
}
