import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import * as AuthActions from './auth.actions';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable()
export class AuthEffects {

    @Effect()
    authSingup = this.actions$.pipe(
        ofType(AuthActions.SINGUP_START)
    )

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBL8mhYwdmMh6IDaCGuNsEZbK2idp4jEBc', {
                email: authData.payload.email,
                password: authData.payload.password,
                returnSecureToken: true
            }).pipe(
                map(respData => {
                    const expirationDate = new Date(new Date().getTime() + +respData.expiresIn * 1000);
                    return new AuthActions.AuthSuccess({ email: respData.email, userId: respData.localId, token: respData.idToken, expirationDate: expirationDate });
                }),
                catchError(errorRes => {
                    let errorMessage = 'an unknown error!';
                    if (!errorRes.error || !errorRes.error.error) {
                        return of(new AuthActions.AuthFail(errorMessage));
                    }
                    switch (errorRes.error.error.message) {
                        case 'EMAIL_EXISTS':
                            errorMessage = 'The email address is already in use by another account.';
                            break;
                        case 'EMAIL_NOT_FOUND':
                            errorMessage = 'This email does not exist';
                            break;
                        case 'INVALID_PASSWORD':
                            errorMessage = 'this password is not correct';
                            break;
                    }
                    return of(new AuthActions.AuthFail(errorMessage))
                })
            );
        }),

    );

    @Effect({ dispatch: false })
    authSuccess = this.actions$
        .pipe(
            ofType(AuthActions.AUTH_SUCCESS),
            tap(() => {
                this.router.navigate(['/']);
            }))

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router
    ) { }
}