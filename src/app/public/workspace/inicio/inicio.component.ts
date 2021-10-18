import { Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario';
import { ApiManager } from 'src/app/network/apiManager';
import { LoggedInCallback } from 'src/app/service/cognito.service';
import { MessageService } from 'src/app/service/message.service';
import { UserLoginService } from 'src/app/service/user-login.service';
import { UserSessionService } from 'src/app/service/user-session.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html'
})
export class InicioComponent implements OnInit, LoggedInCallback  {

  ciBancoUser: Usuario = {};
  loading = false;
  numAplicaciones: number = -1;
  colorScheme = {
    domain: ['#08DDC1']
  };
  data = [
    {
      name: "Consumo Mensual",
      series: [
        {
          name: "S1",
          value: 14
        },
        {
          name: "S2",
          value: 35
        },
        {
          name: "S3",
          value: 4
        },
        {
          name: "S4",
          value: 17
        }
      ]
    }
  ];

  constructor(public media: MediaObserver, 
              private userSessionService: UserSessionService,
              public apiManager: ApiManager,
              public router: Router,
              public userService: UserLoginService,
              private homeComponent: HomeComponent,
              public messageService: MessageService) { }

  customColors(value: any): string {
    return "#CDE6D8";
  }

  ngOnInit(): void {
    this.loading = true;
    this.userService.isAuthenticated(this);
  }

  getApps(){
    this.loading = true;
    if(this.ciBancoUser.idUsuario) {

      this.apiManager.getUserApps(this.ciBancoUser.idUsuario).then(appsResponse => {
        if (appsResponse.success && appsResponse.data) {
          this.loading = false;
          this.numAplicaciones = appsResponse.data.length;
        } else {
          this.loading = false;
          this.messageService.openSnackBar(appsResponse.message, 'error');
        }
      }, error => {
        this.loading = false;
        this.messageService.openSnackBar("Error al recuperar la información de apps: "+error,'error');
      });
    }else{
      this.loading = false;
      this.messageService.openSnackBar("Error al recuperar la información de usuario",'error');
    }
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (!isLoggedIn) {
      this.router.navigate(["/login"]);
    }else{
      this.ciBancoUser = this.userSessionService.getUserSession();
      if(!this.ciBancoUser.idUsuario){
        this.userSessionService.loadUserData().then(res => {
          this.loading = false;
          this.ciBancoUser = this.userSessionService.getUserSession();
          this.homeComponent.user = this.userSessionService.getUserSession();
          this.getApps();
        },error => {
          this.loading = false;
          this.messageService.openSnackBar("Error al recuperar la información de usuario",'error');
        });
      }else{
          this.loading = false;
          this.ciBancoUser = this.userSessionService.getUserSession();
          this.getApps();
      }
    }
  }

}
