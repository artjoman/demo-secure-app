import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService,
        private router: Router,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.authenticationService.currentUserValue;
        request = request.clone({
            setHeaders: {
                Authorization: `Basic ${currentUser}`
            }
        });

        return next.handle(request).pipe(
            catchError(err => {
                if (err instanceof HttpErrorResponse) {

                    if (err.status === 401 || err.status === 403) {
                        this.authenticationService.logout();
                        this.router.navigate(['login']);
                    }

                    // return the error back to the caller
                    return throwError(err);
                }
            }),
            finalize(() => {
                // any cleanup or final activities
            })
        );
    }
}