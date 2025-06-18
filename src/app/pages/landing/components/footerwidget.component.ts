import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'footer-widget',
    imports: [RouterModule],
    templateUrl : './footerwidget.component.html'
})
export class FooterWidget {
    constructor(public router: Router) {}
}
