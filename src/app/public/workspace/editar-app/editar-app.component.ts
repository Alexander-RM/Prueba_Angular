import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiManager } from 'src/app/network/apiManager';
import { MessageService } from 'src/app/service/message.service';
import { MaskUtilComponent } from 'src/app/shared/utils/mask-util-component';

@Component({
  selector: 'app-editar-app',
  templateUrl: './editar-app.component.html'
})
export class EditarAppComponent implements OnInit {

  formEditar: FormGroup;
  loading = false;
  dataApp: any;

  constructor(
    public apiManager: ApiManager,
    public messageService: MessageService,
    private dialogRef: MatDialogRef<EditarAppComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder) {
      this.formEditar = this.formBuilder.group({
        nombreApp: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[a-zA-ZñÑ ]{1,254}$/),
            Validators.minLength(MaskUtilComponent.Size.MIN_PEOPLE_NAME_SIZE),
            Validators.maxLength(MaskUtilComponent.Size.MAX_PEOPLE_NAME_SIZE),
          ],
        ],
        descripcion: [
          '',
          [
            Validators.required,
            Validators.maxLength(250),
          ],
        ],
        url: [
          '',
          [
            Validators.required,
            Validators.pattern(/^http[s]?:\/\/[\w]/),
          ],
        ]
      });
    }

  ngOnInit(): void {
    console.log(this.data);
    this.dataApp = {
      name : this.data.name,
      descripcion: this.data.descripcion,
      url: this.data.url
    };
  }

  close(confirm: boolean): void{
    if(confirm){
      this.editar(this.data);
    }else{
      this.dialogRef.close(confirm);
    }

  }

  editar(data: any): void {
      this.loading = true;
      this.apiManager.updateCognitoClient({clientName: this.formEditar.controls['nombreApp'].value, clientId: data.clientId}).then(cognitoClientUpdateResponse => {

        if (cognitoClientUpdateResponse.success) {

          const appCiBanco = {
            nombre: this.formEditar.controls['nombreApp'].value,
            descripcion: this.formEditar.controls['descripcion'].value,
            url: this.formEditar.controls['url'].value,
            appId: data.appId

          };

          this.apiManager.updateApp(appCiBanco).then(applicationUpdateResponse => {
            if (applicationUpdateResponse.success) {
              this.dialogRef.close(true);
              this.loading = false;
            } else {
              this.loading = false;
              this.messageService.openSnackBar(applicationUpdateResponse.message, 'error');
            }
          }, error => {
            this.loading = false;
            this.messageService.openSnackBar("Error en alta de app bd: " + error, 'error');
          });
        } else {
          this.loading = false;
          this.messageService.openSnackBar(cognitoClientUpdateResponse.message, 'error');
        }
      }, error => {
        this.loading = false;
        this.messageService.openSnackBar("Error en alta de app cognito: " + error, 'error');
      });
  }

}
