import {Inject, Injectable} from "@angular/core";
import {CognitoCallback, CognitoUtil} from "./cognito.service";
import {AuthenticationDetails, CognitoUser, CognitoUserAttribute} from "amazon-cognito-identity-js";
import {RegistrationUser} from "../public/auth/register/registration.component";
import {NewPasswordUser} from "../public/auth/newpassword/newpassword.component";

@Injectable()
export class UserRegistrationService {

    constructor(@Inject(CognitoUtil) public cognitoUtil: CognitoUtil) {

    }

    register(user: RegistrationUser, callback: CognitoCallback): void {

        let attributeList = [];

        let dataEmail = {
            Name: 'email',
            Value: user.email
        };
        let dataNombre = {
            Name: 'name',
            Value: user.nombre
        };

        let dataApPaterno = {
            Name: 'custom:apPaterno',
            Value: user.apPaterno
        };

        let dataApMaterno = {
            Name: 'custom:apMaterno',
            Value: user.apMaterno
        };

        let dataCompania = {
            Name: 'custom:compania',
            Value: user.compania
        };

        //@ts-ignore
        attributeList.push(new CognitoUserAttribute(dataEmail));
        //@ts-ignore
        attributeList.push(new CognitoUserAttribute(dataNombre));
        //@ts-ignore
        attributeList.push(new CognitoUserAttribute(dataApPaterno));
        //@ts-ignore
        attributeList.push(new CognitoUserAttribute(dataApMaterno));
        //@ts-ignore
        attributeList.push(new CognitoUserAttribute(dataCompania));

        //@ts-ignore
        this.cognitoUtil.getUserPool().signUp(user.email, user.password, attributeList,[], function (err, result) {
            if (err) {
                callback.cognitoCallback(err.message, null);
            } else {
                callback.cognitoCallback('', result);
            }
        });

    }

    confirmRegistration(username: string, confirmationCode: string, cognitoCallback: CognitoCallback): void {

        let userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };

        let cognitoUser = new CognitoUser(userData);

        cognitoUser.confirmRegistration(confirmationCode, true, function (errConfirm, resultConfirm) {
            if (errConfirm) {
                cognitoCallback.cognitoCallback(errConfirm.message, null);
            } else {
                cognitoCallback.cognitoCallback('', resultConfirm);
            }
        });
    }

    resendCode(username: string, callbackResend: CognitoCallback): void {
        let userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };

        let cognitoUser = new CognitoUser(userData);

        cognitoUser.resendConfirmationCode(function (errResend, resultResend) {
            if (errResend) {
                callbackResend.cognitoCallback(errResend.message, null);
            } else {
                callbackResend.cognitoCallback('', resultResend);
            }
        });
    }

    newPassword(newPasswordUser: NewPasswordUser, callback: CognitoCallback): void {
        //console.log(newPasswordUser);
        // Get these details and call
        //cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, this);
        let authenticationData = {
            Username: newPasswordUser.username,
            Password: newPasswordUser.existingPassword,
        };
        //@ts-ignore
        let authenticationDetails = new AuthenticationDetails(authenticationData);

        let userData = {
            Username: newPasswordUser.username,
            Pool: this.cognitoUtil.getUserPool()
        };

        //console.log("UserLoginService: Params set...Authenticating the user");
        //@ts-ignore
        let cognitoUser = new CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            newPasswordRequired: function (userAttributes, requiredAttributes) {
                // User was signed up by an admin and must provide new
                // password and required attributes, if any, to complete
                // authentication.

                // the api doesn't accept this field back
                delete userAttributes.email_verified;
                //@ts-ignore
                cognitoUser.completeNewPasswordChallenge(newPasswordUser.password, requiredAttributes, {
                    onSuccess: function (result) {
                        callback.cognitoCallback('', userAttributes);
                    },
                    onFailure: function (err) {
                        callback.cognitoCallback(err, null);
                    }
                });
            },
            onSuccess: function (result) {
                callback.cognitoCallback('', result);
            },
            onFailure: function (err) {
                callback.cognitoCallback(err, null);
            }
        });
    }
}
