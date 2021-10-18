import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MediaObserver } from '@angular/flex-layout';
import { ApiManager } from "../../../network/apiManager";
import { MessageService } from "../../../service/message.service";
import { Usuario } from "../../../interfaces/usuario";
import { UserSessionService } from 'src/app/service/user-session.service';
import { MaskUtilComponent } from '../../../shared/utils/mask-util-component';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Aplicaciones } from "../../../interfaces/aplicaciones";

@Component({
  selector: 'app-stepper-overview',
  templateUrl: './stepper-overview.component.html'
})
export class StepperOverviewComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isEditable = true;
  orientation: any = 'horizontal';
  @Input() showHeader: boolean = false;
  @Input() appToUpdate : Aplicaciones = {idAplicaciones: 0, nombre: "", descripcion: "", clientSecret: "", clientid: "", habilitado: false, url: "", idUsuario: "" };
  newSecret = "";
  newClientId = "";
  ciBancoUser: Usuario = {}
  loading = false;
  paso='1';

  constructor(
    private formBuilder: FormBuilder,
    public media: MediaObserver,
    public apiManager: ApiManager,
    public messageService: MessageService,
    private userSessionService: UserSessionService) {
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
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
    this.ciBancoUser = this.userSessionService.getUserSession();
  }

  finalizar(): void {

    this.loading = true;

    if(this.appToUpdate.idAplicaciones == 0) {
      const appCognito = {clientName: this.secondFormGroup.controls['nombreApp'].value};
      this.apiManager.createCognitoClient(appCognito).then(cognitoClientResponse => {

        if (cognitoClientResponse.success && cognitoClientResponse.data && this.ciBancoUser.idUsuario) {

          const dataApp = cognitoClientResponse.data as any;

          const appCiBanco = {
            nombre: this.secondFormGroup.controls['nombreApp'].value,
            descripcion: this.secondFormGroup.controls['descripcion'].value,
            url: this.secondFormGroup.controls['url'].value,
            clientId: dataApp.clientId,
            clientSecret: dataApp.clientSecret,
            idUsuario: this.ciBancoUser.idUsuario
          };

          this.apiManager.createUserApp(appCiBanco).then(applicationCreateResponse => {
            if (applicationCreateResponse.success) {
              this.newClientId = dataApp.clientId;
              this.newSecret = dataApp.clientSecret;
              this.isEditable = false;
              this.loading = false;
            } else {
              this.loading = false;
              this.messageService.openSnackBar(applicationCreateResponse.message, 'error');
            }
          }, error => {
            this.loading = false;
            this.messageService.openSnackBar("Error en alta de app bd: " + error, 'error');
          });
        } else {
          this.loading = false;
          this.messageService.openSnackBar(cognitoClientResponse.message, 'error');
        }
      }, error => {
        this.loading = false;
        this.messageService.openSnackBar("Error en alta de app cognito: " + error, 'error');
      });
    }
  }

  copyText(): void {
    this.messageService.openSnackBar('Texto copiado', 'info');
  }
  selectionChange(event: StepperSelectionEvent) {
    this.paso = event.selectedStep.label;
  }

}
