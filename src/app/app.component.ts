import { Component, OnInit } from "@angular/core";
import { AwsUtil } from "./service/aws.service";
import { UserLoginService } from "./service/user-login.service";
import { CognitoUtil, LoggedInCallback } from "./service/cognito.service";
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, LoggedInCallback {

  constructor(
      public awsUtil: AwsUtil,
      public userService: UserLoginService,
      public cognito: CognitoUtil,
      private matIconRegistry: MatIconRegistry,
      private domSanitizer: DomSanitizer,
      private translate: TranslateService) {

        translate.setDefaultLang('es');
        this.matIconRegistry.addSvgIcon(
            'crear_app', this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/img/CrearAplicacion.svg')
        ).addSvgIcon(
            'selecciona_servicio', this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/img/SeleccionarServicios.svg')
        ).addSvgIcon(
            'resumen', this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/img/Resumen.svg')
        );
  }

  ngOnInit() {
      this.userService.isAuthenticated(this);
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
      let mythis = this;
      this.cognito.getIdToken({
          callback() {
            console.log("callback");
          },
          callbackWithParam(token: any) {
              // Include the passed-in callback here as well so that it's executed downstream
              //console.log("AppComponent: calling initAwsService in callback")
              //@ts-ignore
              mythis.awsUtil.initAwsService(null, isLoggedIn, token);
          }
      });
  }
}
