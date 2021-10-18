import {Injectable} from "@angular/core";
import { CognitoUser } from "amazon-cognito-identity-js";
import { RegistrationUser } from "../public/auth/register/registration.component";
import {Callback, CognitoUtil} from "./cognito.service";

@Injectable()
export class UserParametersService {

    constructor(public cognitoUtil: CognitoUtil) {
    }

    getUserInfo(): Promise<RegistrationUser> {
        let cognitoUser = this.cognitoUtil.getCurrentUser();
        return new Promise((resolve, reject) => {
            if (cognitoUser) {
                this.valSesion(cognitoUser).then(sesionActive =>{
                    if (cognitoUser) {
                        this.mapParameters(cognitoUser).then(userParameters =>{
                            resolve(userParameters);
                        },error => {
                            reject("UserParametersService: Couldn't retrieve the user"+error);
                        });
                    }else{
                        reject('cognitoUser undefined');
                    }
                }, error =>{
                    reject("UserParametersService: Couldn't retrieve the user"+error);
                });
                
            }else{
                reject('cognitoUser undefined');
            }
        });
    }

    async valSesion(cognitoUser: CognitoUser): Promise<boolean>{
        return new Promise((resolve, reject) => {
            cognitoUser.getSession(function (err: any) {
                if (err){
                    reject("UserParametersService: Couldn't retrieve the user");
                }else{
                    resolve(true);
                }
            });
        });
    }

    async mapParameters(cognitoUser: CognitoUser): Promise<RegistrationUser>{
        let registrationUser : RegistrationUser = {};
        return new Promise((resolve, reject) => {
            cognitoUser.getUserAttributes(function (err, result) {
                if (err) {
                    reject("UserParametersService: in getParameters: " + err);
                } else {
                    if(result){
                        result.forEach(at => {
                            switch(at.Name){
                                case 'email':
                                    registrationUser.email = at.Value;
                                break;
                                case 'name':
                                    registrationUser.nombre = at.Value;
                                break;
                                case 'custom:apPaterno':
                                    registrationUser.apPaterno = at.Value;
                                break;
                                case 'custom:apMaterno':
                                    registrationUser.apMaterno = at.Value;
                                break;
                                case 'custom:compania':
                                    registrationUser.compania = at.Value;
                                break;
                            }
                            
                        });
                    }

                    resolve(registrationUser);
                }
            });
        });
    }

    getParameters(callback: Callback) {
        let cognitoUser = this.cognitoUtil.getCurrentUser();

        if (cognitoUser != null) {
            //@ts-ignore
            cognitoUser.getSession(function (errSesion: any, sesion) {
                if (errSesion){
                    console.log("UserParametersService: Couldn't retrieve the user");
                }else {
                    //@ts-ignore
                    cognitoUser.getUserAttributes(function (errUser :any, result) {
                        if (errUser) {
                            console.log("UserParametersService: in getParameters: " + errUser);
                        } else {
                            callback.callbackWithParam(result);
                        }
                    });
                }

            });
        } else {
            callback.callbackWithParam(null);
        }
    }

}