import { Component } from '@angular/core';
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
export class LoginComponent {
    email: string = '';
    senha: string = '';
    checked: boolean = false;
    errorMessage: string = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    onSubmit(): void {
        this.errorMessage = '';

        const credentials: AuthLogin = {
            email: this.email,
            senha: this.senha
        };

        this.authService.login(credentials).subscribe({
            next: (response) => {
                console.log('Login bem-sucedido!', response);

                this.authService.saveToken(response.token, this.checked);
                this.router.navigate(['/']);
            },
            error: (error) => {
                console.error(error);
                this.errorMessage = 'E-mail ou senha inválidos.';
            }
        });
    }

    toSignUp(): void {
        this.router.navigate(['/auth/signUp']);
    }
}
