import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { authGuard } from './app/pages/auth/guards/auth.guard';
import { DashboardFinanceiroComponent } from './app/pages/financeiro/components/dashboard.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout, canActivate: [authGuard],
        children: [
            { path: '', component: DashboardFinanceiroComponent },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'landing', component: Landing, canActivate: [authGuard] },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
