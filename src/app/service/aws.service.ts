import {Injectable} from "@angular/core";
import {Callback, CognitoUtil} from "./cognito.service";
import * as AWS from "aws-sdk/global";

/**
 * Created by Vladimir Budilov
 */


@Injectable()
export class AwsUtil {
    public static firstLogin: boolean = false;
    public static runningInit: boolean = false;

    constructor(public cognitoUtil: CognitoUtil) {
        AWS.config.region = CognitoUtil._REGION;
    }

    /**
     * This is the method that needs to be called in order to init the aws global creds
     */
    initAwsService(callback: Callback, isLoggedIn: boolean, idToken: string) {

        if (AwsUtil.runningInit) {
            // Need to make sure I don't get into an infinite loop here, so need to exit if this method is running already
            //console.log("AwsUtil: Aborting running initAwsService()...it's running already.");
            // instead of aborting here, it's best to put a timer
            if (callback) {
                callback.callback();
                callback.callbackWithParam(null);
            }
            return;
        }


        AwsUtil.runningInit = true;


        let mythis = this;
        // First check if the user is authenticated already
        if (isLoggedIn)
            mythis.setupAWS(isLoggedIn, callback, idToken);

    }


    /**
     * Sets up the AWS global params
     *
     * @param isLoggedIn
     * @param callback
     */
    setupAWS(isLoggedIn: boolean, callback: Callback, idToken: string): void {
        if (isLoggedIn) {
            console.log("AwsUtil: User is logged in");
        }
        else {
            console.log("AwsUtil: User is not logged in");
        }

        if (callback != null) {
            callback.callback();
            callback.callbackWithParam(null);
        }

        AwsUtil.runningInit = false;
    }

    addCognitoCredentials(idTokenJwt: string): void {
        let creds = this.cognitoUtil.buildCognitoCreds(idTokenJwt);

        AWS.config.credentials = creds;

        creds.get(function (err) {
            if (!err) {
                if (AwsUtil.firstLogin) {
                    // save the login info to DDB
                    //REVISAR: this.ddb.writeLogEntry("login");
                    AwsUtil.firstLogin = false;
                }
            }
        });
    }

    static getCognitoParametersForIdConsolidation(idTokenJwt: string): any {
        let url: any = 'cognito-idp.' + CognitoUtil._REGION.toLowerCase() + '.amazonaws.com/' + CognitoUtil._USER_POOL_ID;
        let logins: Array<string> = [];
        logins[url] = idTokenJwt;
        return {
            Logins: logins
        };
    }

}
