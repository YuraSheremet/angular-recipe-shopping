import { NgModule } from '@angular/core';
import { AuthInterseptorService } from './auth/auth-interseptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterseptorService,
            multi: true
        }
    ]
})
export class CoreModule { }