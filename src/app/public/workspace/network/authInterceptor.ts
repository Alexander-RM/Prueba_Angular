import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Router } from "@angular/router";
import { JwtComponent } from "../secure/jwttokens/jwt.component";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            constructor(public router: Router, public jwt: JwtComponent) {
            }

            intercept(req: HttpRequest < any >, next: HttpHandler): Observable < HttpEvent < any >> {
                if(!this.jwt.stuff.accessToken) {
                return next.handle(req);
            }
            const headers = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            headers: req.headers.set('Authorization', `Bearer ${!this.jwt.stuff.accessToken}`)
            });
            return next.handle(headers);
        }
    }

}