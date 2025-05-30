import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AppCommonModule } from '../../../../../app.common.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'app-sign-up',
    imports: [AppCommonModule],
    templateUrl: './sign-up.component.html',
    styleUrl: './sign-up.component.scss',
    providers: [provideNgxMask()]
})
export class SignUpComponent {
    step = 1;
    form: FormGroup = new FormGroup({
        empresaForm: new FormGroup({
            razaoSocial: new FormControl(null, Validators.required),
            email: new FormControl(null, [Validators.required, Validators.email]),
            cnpj: new FormControl(null, Validators.required),
            telefone: new FormControl(null, Validators.required),
            cep: new FormControl(null, Validators.required),
            uf: new FormControl(null, Validators.required),
            cidade: new FormControl(null, Validators.required),
            logradouro: new FormControl(null, Validators.required),
            bairro: new FormControl(null, Validators.required),
            numero: new FormControl(null, Validators.required),
            complemento: new FormControl(null)
        }),
        representante: new FormGroup({
            nome: new FormControl(null, Validators.required),
            email: new FormControl(null, [Validators.required, Validators.email]),
            cpf: new FormControl(null, Validators.required),
            rg: new FormControl(null, Validators.required),
            telefone: new FormControl(null, Validators.required),
            cep: new FormControl(null, Validators.required),
            uf: new FormControl(null, Validators.required),
            cidade: new FormControl(null, Validators.required),
            logradouro: new FormControl(null, Validators.required),
            bairro: new FormControl(null, Validators.required),
            numero: new FormControl(null, Validators.required),
            complemento: new FormControl(null),
            password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
            confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(6)])
        })
    });

    constructor(
        public authService: AuthService,
        public router: Router
    ) {}

    onSubmit(): void {}

    onRedirectToLogin(): void {
        this.router.navigate(['/auth/login']);
    }
}
