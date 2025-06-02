import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from './app/layout/component/app.floatingconfigurator';
import { StepperModule } from 'primeng/stepper';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

const ANGULAR_IMPORTS = [
    CommonModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    RouterModule,
    RippleModule,
    AppFloatingConfigurator,
    StepperModule,
    ReactiveFormsModule,
    ScrollPanelModule,
    NgxMaskDirective,
    NgxMaskPipe,
    ToastModule
];

@NgModule({
    imports: [ANGULAR_IMPORTS],
    exports: [ANGULAR_IMPORTS],
    providers: [MessageService] 
})
export class AppCommonModule {}
