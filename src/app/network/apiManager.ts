import { int } from "aws-sdk/clients/datapipeline";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {ResponseApi, ResponseAppsApi, ResponseCognitoClientApi, ResponseUserApi} from "../interfaces/responseInterface";
import { SignUp } from "../interfaces/signup";
import { Client } from "../interfaces/client";
import { AplicacionesRequest } from "../interfaces/aplicacionesrequest";
import { Injectable } from "@angular/core";
import { CognitoUtil } from "../service/cognito.service";
import { Router } from "@angular/router";
import { UserLoginService } from "../service/user-login.service";
import { environment } from "src/environments/environment";
import {ClientRequest} from "../interfaces/clientrequest";
import {AplicacionesDeleteRequest} from "../interfaces/aplicacionesdeleterequest";
import {AplicacionesUpdateRequest} from "../interfaces/aplicacionesupdaterequest";

@Injectable({
  providedIn: 'root',
})

export class ApiManager {
  constructor(public userService: UserLoginService, private http: HttpClient, public router: Router, public cognitoUtil: CognitoUtil) {

  }
  API_URL: string = environment.endpoint_lambda;
  APLICACIONES_ENDPOINT: string = "/openbanking/application/";
  COGNITO_ENDPOINT: string = "/openbanking/cognitoapp/";
  USER_ENDPOINT: string = "/openbanking/user/";
  AUTH_ENDPOINT: string = "/openbanking/auth/";
  public accessToken: string = '';

  async getHeaders(): Promise<HttpHeaders> {
    const token = await this.cognitoUtil.getJWT();
    return new HttpHeaders({
      'Authorization': token
    });
  }

  //recupera token por client credential
  async getToken(): Promise<any> {
    return this.http
      .post<any>(this.API_URL + this.AUTH_ENDPOINT + "token/", {"clientId": "6s38burggn4sppb33nmtsja3a9","clientSecret": "t4el2g9tlfp0o4vprpdck80ndisjauh2vcm6erfn7lhq1pcc700"},
        {
          headers: await this.getHeaders()
        })
      .toPromise();
  }

  async getUserApps(userId: number): Promise<ResponseAppsApi> {
    return this.http
      .get<ResponseAppsApi>(this.API_URL + this.APLICACIONES_ENDPOINT + "user/" + userId.toString(),
        {
          headers: await this.getHeaders()
        })
      .toPromise();
  }

  async getAppInfo(appId: int): Promise<ResponseApi> {
    return this.http
      .get<ResponseApi>(this.API_URL + this.APLICACIONES_ENDPOINT + appId.toString(),
        {
          headers: await this.getHeaders()
        })
      .toPromise();
  }

  async getUserInfo(email: string): Promise<ResponseUserApi> {
    return this.http
      .get<ResponseUserApi>(this.API_URL + this.USER_ENDPOINT + "email/" + email,
        {
          headers: await this.getHeaders()
        })
      .toPromise();
  }

  async createUser(user: SignUp): Promise<ResponseApi> {
    return this.http
      .post<ResponseApi>(this.API_URL + this.USER_ENDPOINT + "create", user,
        {
          headers: await this.getHeaders()
        })
      .toPromise();
  }

  async createCognitoClient(clientRequest: Client): Promise<ResponseCognitoClientApi> {
    return this.http
      .post<ResponseCognitoClientApi>(this.API_URL + this.COGNITO_ENDPOINT + "create", clientRequest,
        {
          headers: await this.getHeaders()
        })
      .toPromise();
  }

  async createUserApp(appRequest: AplicacionesRequest): Promise<ResponseApi> {
    return this.http
      .post<ResponseApi>(this.API_URL + this.APLICACIONES_ENDPOINT + "create", appRequest,
        {
          headers: await this.getHeaders()
        })
      .toPromise();
  }

  async deleteCognitoClient(clientRequest: ClientRequest): Promise<ResponseApi> {
    return this.http
      .post<ResponseApi>(this.API_URL + this.COGNITO_ENDPOINT + "deactivate",clientRequest,
        {
          headers: await this.getHeaders()
        })
      .toPromise();
  }

  async updateCognitoClient(clientRequest: ClientRequest): Promise<ResponseApi> {
    return this.http
      .post<ResponseApi>(this.API_URL + this.COGNITO_ENDPOINT + "update" ,clientRequest,
        {
          headers: await this.getHeaders()
        })
      .toPromise();
  }

  async deleteApp(applicacionesDeleteRequest: AplicacionesDeleteRequest): Promise<ResponseApi> {
    return this.http
      .post<ResponseApi>(this.API_URL + this.APLICACIONES_ENDPOINT + "deactivate",applicacionesDeleteRequest,
        {
          headers: await this.getHeaders()
        })
      .toPromise();
  }

  async updateApp(appRequest: AplicacionesUpdateRequest): Promise<ResponseApi> {
    return this.http
      .post<ResponseApi>(this.API_URL + this.APLICACIONES_ENDPOINT + "update",appRequest,
        {
          headers: await this.getHeaders()
        })
      .toPromise();
  }
}

