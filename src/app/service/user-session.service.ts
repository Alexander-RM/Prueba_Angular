import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuario';
import { ApiManager } from '../network/apiManager';
import { RegistrationUser } from '../public/auth/register/registration.component';
import { UserParametersService } from './user-parameters.service';

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {

  userSession: Usuario = {};

  constructor(public userParametersService: UserParametersService,
    public  apiManager: ApiManager) { 
    console.log("constructor");
  }

  setUserSession(userSession: Usuario): void{
    this.userSession = userSession;
  }

  getUserSession(): Usuario{
    return this.userSession;
  }

  setToken(token: string): void{
    sessionStorage.setItem('token',token);
  }

  getToken(): string{
      const token = sessionStorage.getItem('token');
      return token ? token : '';
  }

  async loadUserData(): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const user = this.getUserSession();
        if(!user.idUsuario){
            this.userParametersService.getUserInfo().then(data => {
                this.getOrCreateUser(data).then(existUser =>{
                    if(existUser){
                        resolve(true);
                    }else{
                        reject(false);
                    }
                }, error => {
                    reject(false);
                });
            },error => {
                reject(false);
            });
        }else{
            resolve(true);
        }
    });
  }

  async getOrCreateUser(data: RegistrationUser) {
    return new Promise((resolve, reject) => {
        if(data.email){
            this.apiManager.getUserInfo(data.email).then(userResponse => {
                if(userResponse.success){
                    this.setUserSession(userResponse.data!);
                    resolve(true);
                }else{
                    const user = {
                        correo: data.email, 
                        nombre: data.nombre, 
                        apellidoPaterno: data.apPaterno, 
                        apellidoMaterno: data.apMaterno ? data.apMaterno : '', 
                        compania: data.compania ? data.compania : '', 
                        cognitoUid: data.email
                    };
                    this.apiManager.createUser(user).then(userCreate => {
                        if(userCreate.success){
                            this.setUserSession(userCreate.data as Usuario);
                            resolve(true);
                        }else{
                            reject(false);
                        }
                    }, error => {
                        reject(false);
                    });
                }
            }, error => {
                reject(false);
            });
        }else{
            reject(false);
        } 
    });
  }
}
