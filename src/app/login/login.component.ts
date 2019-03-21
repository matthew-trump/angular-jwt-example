import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { catchError, tap, takeUntil } from 'rxjs/operators';

import { AuthService } from '../auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

    form: FormGroup;

    loginError: boolean = false;
    inProgress: boolean = false;

    unsubscribe$: Subject<null> = new Subject();

    constructor(private fb: FormBuilder,
        private authService: AuthService,
        private router: Router) {

        this.form = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    login() {
        const val = this.form.value;
        this.inProgress = true;
        this.loginError = false;
        if (val.email && val.password) {
            this.authService.login(val.email, val.password)
                .pipe(
                    catchError(err => {
                        this.inProgress = false;
                        this.loginError = true;
                        console.log(err);
                        return of(null);
                    }),
                    tap((result) => {
                        this.inProgress = false;
                        if (result) {
                            console.log("User is logged in");
                            this.router.navigateByUrl('/');
                        }
                    }),
                    takeUntil(this.unsubscribe$)
                )
                .subscribe(_ => { });
        }
    }

    ngOnInit() {
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

}
