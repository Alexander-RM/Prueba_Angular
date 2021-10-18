import {Component, OnInit} from '@angular/core';
import { ApiManager } from "../../../network/apiManager";
import { Usuario } from "../../../interfaces/usuario";
import { UserLoginService } from "../../../service/user-login.service";
import { Router } from "@angular/router";
import { MessageService } from "../../../service/message.service";
import { Aplicaciones } from "../../../interfaces/aplicaciones";
import { UserSessionService } from 'src/app/service/user-session.service';
import { MediaObserver } from '@angular/flex-layout';
import { LoggedInCallback } from 'src/app/service/cognito.service';
import { HomeComponent } from '../../home.component';
import { EditarAppComponent } from '../editar-app/editar-app.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-aplicaciones',
  templateUrl: './aplicaciones.component.html'
})
export class AplicacionesComponent implements OnInit, LoggedInCallback {

  arrayApp = [] as any;

  showCrearApp = false;
  textBotonApp = 'Crear App';
  ciBancoUser: Usuario = {}
  loading = false;
  appToUpdate: Aplicaciones = {idAplicaciones: 0, nombre: "", descripcion: "", clientSecret: "", clientid: "", habilitado: false, url: "", idUsuario: "" };
  aplicacionesResponse: Array<Aplicaciones> = [];

  constructor(public apiManager: ApiManager, 
    public userService: UserLoginService,
    public router: Router,
    public messageService: MessageService,
    private userSessionSer: UserSessionService,
    private homeComponent: HomeComponent,
    public media: MediaObserver,
    public dialog: MatDialog) { }

ngOnInit(): void {
  this.loading = true;
  this.userService.isAuthenticated(this);
}

toggleApp(estatus: boolean): void {
  if(estatus) {
    this.showCrearApp = false;
    this.textBotonApp = 'Crear App';
    this.getApplications();
  }else{
    this.showCrearApp = true;
    this.textBotonApp = 'Consultar App';
  }
}

getApplications(){
  this.loading = true;
  this.aplicacionesResponse = [];
  if (this.ciBancoUser.idUsuario) {
    this.arrayApp = [];
    this.apiManager.getUserApps(this.ciBancoUser.idUsuario).then(appsResponse => {
      if (appsResponse.success && appsResponse.data) {
        this.loading = false;
        this.aplicacionesResponse = appsResponse.data;
        appsResponse.data.forEach((app: Aplicaciones) => {
          this.arrayApp.push({ name: app.nombre, clientId: app.clientid, secretId: app.clientSecret, appId: app.idAplicaciones,habilitado: app.habilitado,url: app.url, idUsuario: app.idUsuario, descripcion: app.descripcion });
        });
      } else {
        this.loading = false;
        this.messageService.openSnackBar(appsResponse.message, 'error');
      }
    }, error => {
      this.loading = false;
      this.messageService.openSnackBar("Error al recuperar la información de apps: " + error, 'error');
    });
  } else {
    this.loading = false;
    this.messageService.openSnackBar("Error al recuperar la información de usuario", 'error');
  }
}

isLoggedIn(message: string, isLoggedIn: boolean) {
  if (!isLoggedIn) {
    this.router.navigate(["/login"]);
  } else {
    this.ciBancoUser = this.userSessionSer.getUserSession();
    if (!this.ciBancoUser.idUsuario) {
      this.userSessionSer.loadUserData().then(response => {
        this.loading = false;
        this.ciBancoUser = this.userSessionSer.getUserSession();
        this.homeComponent.user = this.userSessionSer.getUserSession();
        this.getApplications();
      }, err => {
        this.loading = false;
        this.messageService.openSnackBar("Error al recuperar la información de usuario", 'error');
      });
    } else {
      this.loading = false;
      this.ciBancoUser = this.userSessionSer.getUserSession();
      this.getApplications();
    }
  }
}

  eliminar(data : any): void{
    this.loading = true;
    this.apiManager.deleteCognitoClient(data).then(cognitoClientResponse => {

      if (cognitoClientResponse.success) {
        this.apiManager.deleteApp({ appId: data.appId }).then(applicationDeleteResponse => {
          if (applicationDeleteResponse.success) {
            this.messageService.openSnackBar('Aplicación eliminada exitosamente', 'success');
            this.loading = false;
            this.getApplications();
          } else {
            this.loading = false;
            this.messageService.openSnackBar(applicationDeleteResponse.message, 'error');
          }
        }, error => {
          this.loading = false;
          this.messageService.openSnackBar("Error de eliminacion de app bd: " + error, 'error');
        });
      } else {
        this.loading = false;
        this.messageService.openSnackBar(cognitoClientResponse.message, 'error');
      }
    }, error => {
      this.loading = false;
      this.messageService.openSnackBar("Error de eliminacion cognito: " + error, 'error');
    });
  }

  editar(data : any ): void {
    this.openDialog(data);
  }

  openDialog(data: any): void {
    const dialogRef = this.dialog.open(EditarAppComponent, {
      width: '400px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.messageService.openSnackBar("Modificación exitosa", 'success');
        this.getApplications();
      }
    });
  }
}
