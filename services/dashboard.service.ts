// Plain TypeScript class (Angular artifacts removed)
// TODO: Integrate with backend or frontend framework as needed

export class DashboardService {
    deviceService: any;
    labService: any;

    constructor(deviceService: any, labService: any) {
        this.deviceService = deviceService;
        this.labService = labService;
    }

    async getUserDevices(userId: string): Promise<any[]> {
        const devices: any[] = await this.deviceService.getDevices();
        return devices.filter((device: any) => device.userId === userId);
    }

    async getUserLabs(userId: string): Promise<any[]> {
        const labs: any[] = await this.labService.getLabs();
        return labs.filter((lab: any) => lab.userId === userId);
    }
}
