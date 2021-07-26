import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { take, exhaustMap } from "rxjs/operators";

@Injectable()
export class AuthInterseptorService implements HttpInterceptor {

    constructor(
        private authService: AuthService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.authService.user.pipe(take(1), exhaustMap(user => {
            if (!user) {
                return next.handle(req);
            }
            const modified = req.clone({params: new HttpParams().set('auth', user.token)})
            return next.handle(modified);
        }));
    }
}