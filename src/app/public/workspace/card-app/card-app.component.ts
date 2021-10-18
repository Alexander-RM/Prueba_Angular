import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MessageService } from 'src/app/service/message.service';
import { Usuario } from "../../../interfaces/usuario";
import { ApiManager } from "../../../network/apiManager";
import {MatDialog} from '@angular/material/dialog';
import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
  selector: 'app-card-app',
  templateUrl: './card-app.component.html'
})
export class CardAppComponent implements OnInit {

  @Input() app = {
    name: '',
    clientId: '',
    secretId: '',
    description: '',
    appId: 0,
    habilitado: false,
    url: '',
    idUsuario: ''
  }
  ciBancoUser: Usuario = {};
  loading = false;
  @Output () eventoEliminar: EventEmitter<any> = new EventEmitter();
  @Output () eventoEditar: EventEmitter<any> = new EventEmitter();

  constructor(
    public apiManager: ApiManager,
    public messageService: MessageService,
    public dialog: MatDialog) { }


  ngOnInit(): void {
    console.log("init");
  }

  copyText(): void {
    this.messageService.openSnackBar('Texto copiado', 'info');
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '350px',
      data: {appName: this.app.name}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.eventoEliminar.emit(
          { 
            clientName: this.app.name, 
            clientId: this.app.clientId,
            appId: this.app.appId
          }
        );
      }
    });
  }

  eliminar(): void {
    this.openDialog();
  }

  editar(): void {
    this.eventoEditar.emit(this.app);
  }
}
