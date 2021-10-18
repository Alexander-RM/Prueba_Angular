import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";
import { CognitoCallback, CognitoUtil, LoggedInCallback } from "./cognito.service";
import { AuthenticationDetails, CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js";
import * as STS from "aws-sdk/clients/sts";

@Injectable()
export class UserLoginService {

    private onLoginSuccess = (callback: CognitoCallback, session: CognitoUserSession) => {
        let clientParams: any = {};
        if (environment.sts_endpoint) {
            clientParams.endpoint = environment.sts_endpoint;
        }
        let sts = new STS(clientParams);
        //@ts-ignore
        sts.getCallerIdentity(function (err, data) {
            callback.cognitoCallback('', session);
        });
    }

    //@ts-ignore
    private onLoginError = (callback: CognitoCallback, err) => {
        callback.cognitoCallback(err.message, null);
    }

    constructor(
        //public ddb: DynamoDBService, 
        public cognitoUtil: CognitoUtil) {
    }

    authenticate(username: string, password: string, callback: CognitoCallback) {

        let authenticationData = {
            Username: username,
            Password: password,
        };
        let authenticationDetails = new AuthenticationDetails(authenticationData);

        let userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };

        let cognitoUser = new CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            newPasswordRequired: (userAttributes, requiredAttributes) => callback.cognitoCallback(`User needs to set password.`, null),
            onSuccess: result => this.onLoginSuccess(callback, result),
            onFailure: err => this.onLoginError(callback, err),
            mfaRequired: (challengeName, challengeParameters) => {
                //@ts-ignore
                callback.handleMFAStep(challengeName, challengeParameters, (confirmationCode: string) => {
                    cognitoUser.sendMFACode(confirmationCode, {
                        onSuccess: result => this.onLoginSuccess(callback, result),
                        onFailure: err => this.onLoginError(callback, err)
                    });
                });
            }
        });
    }

    forgotPassword(username: string, callback: CognitoCallback) {
        let userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };

        let cognitoUser = new CognitoUser(userData);

        cognitoUser.forgotPassword({
            onSuccess: function () {
                console.log("forgotPassword");
            },
            onFailure: function (err) {
                callback.cognitoCallback(err.message, null);
            },
            inputVerificationCode() {
                callback.cognitoCallback('', null);
            }
        });
    }

    confirmNewPassword(email: string, verificationCode: string, password: string, callback: CognitoCallback) {
        let userData = {
            Username: email,
            Pool: this.cognitoUtil.getUserPool()
        };

        let cognitoUser = new CognitoUser(userData);

        cognitoUser.confirmPassword(verificationCode, password, {
            onSuccess: function () {
                callback.cognitoCallback('', null);
            },
            onFailure: function (err) {
                callback.cognitoCallback(err.message, null);
            }
        });
    }

    logout() {
        //console.log("UserLoginService: Logging out");
        //@ts-ignore
        //this.ddb.writeLogEntry("logout");
        //@ts-ignore
        this.cognitoUtil.getCurrentUser().signOut();

    }

    isAuthenticated(callback: LoggedInCallback) {
        if (callback == null)
            throw new Error("UserLoginService: Callback in isAuthenticated() cannot be null");

        let cognitoUser = this.cognitoUtil.getCurrentUser();

        if (cognitoUser != null) {
            //@ts-ignore
            cognitoUser.getSession(function (err, session) {
                if (err) {
                    callback.isLoggedIn(err, false);
                }
                else {
                    callback.isLoggedIn(err, session.isValid());
                }
            });
        } else {
            callback.isLoggedIn("Can't retrieve the CurrentUser", false);
        }
    }
}
