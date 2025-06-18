import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { AuthService } from '../../pages/auth/services/auth.service';
import { Router } from '@angular/router';
import { MenuModule } from 'primeng/menu'; 

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator,MenuModule],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <img src="assets/logo.png" alt="logo" class="w-16 h-16"/>
                <span>LYKON | LFS </span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <div> 
                        <p-menu #menu [popup]="true" [model]="overlayMenuItems" appendTo="body"></p-menu>
                        <button type="button" class="layout-topbar-action" (click)="menu.toggle($event)" style="width:auto" pButton icon="pi pi-chevron-down" >
                            <i class="pi pi-user"></i>
                            <span>Perfil</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar implements OnInit{

    constructor(public layoutService: LayoutService, private authService: AuthService, private router: Router) {}

    items!: MenuItem[];

    overlayMenuItems: MenuItem[] = [];

    ngOnInit(): void {
        this.overlayMenuItems.push( {
            label: this.authService.getNome() ?? ""
        },
        {
            separator: true
        },
        {
            label: 'Sair',
            icon: 'pi pi-fw pi-sign-in',
            command: () => this.logout()
        })
    }


    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    logout(){
        this.authService.logout();
        this.router.navigate(['/auth/login']);
    }


}
