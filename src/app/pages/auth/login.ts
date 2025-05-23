import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from './services/auth.service';
import { AuthLogin } from './models/auth.model';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, CommonModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
                            <div class="flex flex-col items-center justify-center">
                                <img src="assets/logo.png" alt="logo">
                            </div>
                            <div class="text-center mb-8">
                                <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Bem vindo ao LERP!</div>
                                <span class="text-muted-color font-medium">Entre na sua conta para continuar</span>
                            </div>

                            <div>
                                <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                                <input pInputText id="email1" type="text" placeholder="Endereço de e-mail" class="w-full md:w-[30rem] mb-8" [(ngModel)]="email" name="email" required />

                                <label for="senha" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Senha</label>
                                <p-password id="senha" [(ngModel)]="senha" name="senha" placeholder="Senha" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false" required></p-password>

                                <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                    <div class="flex items-center">
                                        <p-checkbox [(ngModel)]="checked" name="lembrar" id="rememberme1" binary class="mr-2"></p-checkbox>
                                        <label for="rememberme1">Lembre-se de mim</label>
                                    </div>
                                    <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Esqueceu a senha?</span>
                                </div>

                                <p-button label="Entrar" styleClass="w-full" type="submit"></p-button>

                                <div *ngIf="errorMessage" class="text-red-500 mt-4 text-center">
                                    {{ errorMessage }}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login {

    email: string = '';
    senha: string = '';
    checked: boolean = false;
    errorMessage: string = '';

    constructor(private authService: AuthService, private router: Router) {}

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
}
