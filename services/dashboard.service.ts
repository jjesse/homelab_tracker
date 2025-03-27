import { Injectable } from '@angular/core';
import { Device } from '../models/device.model';
import { Lab } from '../models/lab.model';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    getUserDevices(userId: string): Promise<Device[]> {
        return this.deviceService.getDevices()
            .then(devices => devices.filter(device => device.userId === userId));
    }

    getUserLabs(userId: string): Promise<Lab[]> {
        return this.labService.getLabs()
            .then(labs => labs.filter(lab => lab.userId === userId));
    }
}
