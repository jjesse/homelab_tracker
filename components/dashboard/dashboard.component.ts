import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    devices: Device[] = [];
    labs: Lab[] = [];

    constructor(
        private dashboardService: DashboardService,
        private authService: AuthService
    ) {}

    async ngOnInit() {
        const userId = this.authService.getCurrentUser().id;
        this.devices = await this.dashboardService.getUserDevices(userId);
        this.labs = await this.dashboardService.getUserLabs(userId);
    }
}
