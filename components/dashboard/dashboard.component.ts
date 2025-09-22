// Plain TypeScript module (Angular artifacts removed)
// TODO: Integrate with backend or frontend framework as needed

export class Dashboard {
    devices = [];
    labs = [];

    constructor(dashboardService, authService) {
        this.dashboardService = dashboardService;
        this.authService = authService;
    }

    async init() {
        const userId = this.authService.getCurrentUser().id;
        this.devices = await this.dashboardService.getUserDevices(userId);
        this.labs = await this.dashboardService.getUserLabs(userId);
    }
}
