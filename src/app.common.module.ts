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
    MessageModule
];

@NgModule({
    imports: [ANGULAR_IMPORTS],
    exports: [ANGULAR_IMPORTS]
})
export class AppCommonModule {}
