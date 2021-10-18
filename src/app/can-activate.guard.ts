import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { CognitoUtil } from "./service/cognito.service";
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserSessionService } from "./service/user-session.service";

@Injectable()
export class CanActivateGuard implements CanActivate {

    constructor(
        public cognitoUtil: CognitoUtil,
        public router: Router,
        private userSessionService: UserSessionService
    ) {
        console.log("CanActive");
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean | any {

        const sesionActive = this.getSesionActive();
        if(sesionActive){
            return true;
        }else{
            this.router.navigate(["/home/logout"]);
            return false;
        }

    }

    getSesionActive(): boolean{
        const helper = new JwtHelperService();
        const token = this.userSessionService.getToken();
        helper.isTokenExpired(token);
        return true;
    }
}
