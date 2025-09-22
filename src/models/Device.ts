import mongoose, { Schema, Document } from 'mongoose';

export interface IDevice extends Document {
	name: string;
	ipAddress: string;
	operatingSystem: string;
	hostname: string;
	network: string;
	systemRole: string;
	hypervisorInstalledOn: string;
	domainUserSignedIn: string;
	zscalerUserSignedIn?: string;
	zscalerAppSegment?: string;
	notes?: string;
	user: mongoose.Types.ObjectId;
	date?: Date;
}

const DeviceSchema: Schema = new Schema({
	name: { type: String, required: true },
	ipAddress: { type: String, required: true },
	operatingSystem: { type: String, required: true },
	hostname: { type: String, required: true },
	network: { type: String, required: true },
	systemRole: { type: String, required: true },
	hypervisorInstalledOn: { type: String, required: true },
	domainUserSignedIn: { type: String, required: true },
	zscalerUserSignedIn: { type: String, default: 'None' },
	zscalerAppSegment: { type: String, default: 'None' },
	notes: { type: String },
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	date: { type: Date, default: Date.now }
});

const Device = mongoose.model<IDevice>('Device', DeviceSchema);
export default Device;
