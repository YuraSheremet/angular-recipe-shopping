import { Action } from "@ngrx/store";

export const LOGIN_START = '[Auth] Login Start';
export const AUTH_SUCCESS = '[Auth] Login';
export const AUTH_FAIL = '[Auth] Login Fail';
export const SINGUP_START = '[Auth] Singup Start';
// export const SINGUP = '[Auth] Singup';
export const LOGOUT = '[Auth] Logout';

export class AuthSuccess implements Action {
    readonly type = AUTH_SUCCESS;

    constructor(public payload: {email: string, userId: string, token: string, expirationDate: Date}) {}
}

export class Logout implements Action {
    readonly type = LOGOUT;
}

export class LoginStart implements Action {
    readonly type = LOGIN_START;
    constructor(public payload: {email: string; password: string}) {}
}

export class AuthFail implements Action {
    readonly type = AUTH_FAIL;
    constructor(public payload: string) {}
}

export class SingupStart implements Action {
    readonly type = SINGUP_START;
    constructor(public payload: {email: string; password: string}) {}
}

export type AuthActions = AuthSuccess | Logout | LoginStart | AuthFail | SingupStart;