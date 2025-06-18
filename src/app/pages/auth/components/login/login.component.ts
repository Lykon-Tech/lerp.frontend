import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthLogin } from '../../models/auth.model';
import { AppCommonModule } from '../../../../../app.common.module';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [AppCommonModule],
    templateUrl: `./login.component.html`
})
export class LoginComponent implements OnInit{
    email: string = '';
    senha: string = '';
    checked: boolean = false;
    errorMessage: string = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.authService.logout();
    }

    onSubmit(): void {
        this.errorMessage = '';

        const credentials: AuthLogin = {
            email: this.email,
            senha: this.senha
        };

        this.authService.login(credentials).subscribe({
            next: (response) => {
                this.authService.saveDadosUsuario(response, this.checked);
                this.router.navigate(['/']);
            },
            error: (error) => {
                this.errorMessage = error.error.message;
            }
        });
    }
/*
    toSignUp(): void {
        this.router.navigate(['/auth/signUp']);
    }
*/
}
