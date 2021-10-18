import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { MessageComponent } from '../public/message/message.component';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private matSnackBar: MatSnackBar) { }

  openSnackBar(message: string, action: string) {
    let classMessage = '';
    switch (action) {
      case 'error':
        classMessage = 'message-error';
        break;
      case 'warning':
          classMessage = 'message-warning';
          break;
      case 'info':
        classMessage = 'message-info';
        break;
      case 'success':
        classMessage = 'message-success';
        break;
    }

    let config : MatSnackBarConfig = {
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        duration: 5000,
        panelClass: classMessage
    }

    this.matSnackBar.openFromComponent(MessageComponent, {
      data: {
        mensaje: message
      },
      ...config
    });
  }
}
