import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { User } from "./user.model";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    // user = new BehaviorSubject<User | any>(null);
    private tokenExpirationTimer: any;

    constructor(
        private http: HttpClient,
        private router: Router,
        private store: Store<fromApp.AppState>
    ) { }

    singup(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBL8mhYwdmMh6IDaCGuNsEZbK2idp4jEBc', {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError), tap(respData => {
            this.handleAuth(respData.email, respData.localId, respData.idToken, +respData.expiresIn);
        }));
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBL8mhYwdmMh6IDaCGuNsEZbK2idp4jEBc', {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(
            catchError(this.handleError), 
            tap(respData => {this.handleAuth(respData.email, respData.localId, respData.idToken, +respData.expiresIn)}));
    }

    logout() {
        // this.user.next(null);
        this.store.dispatch(new AuthActions.Logout());
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        // console.log(expirationDuration);
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    autoLogin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData') || '');
        if (!userData) return;
        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

        if (loadedUser.token) {
            // this.user.next(loadedUser);
            this.store.dispatch(new AuthActions.AuthSuccess({email: loadedUser.email, userId: loadedUser.id, token: loadedUser.token, expirationDate: new Date(userData._tokenExpirationDate)}));
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    private handleAuth(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        // this.user.next(user);
        this.store.dispatch(new AuthActions.AuthSuccess({email: email, userId: userId, token: token, expirationDate: expirationDate}));
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'an unknown error!';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
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
        return throwError(errorMessage);
    }

}