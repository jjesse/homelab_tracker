import mongoose, { Schema, Document } from 'mongoose';

export interface IDevice extends Document {
	name: string;
	type: string;
	status: string;
	// Add more fields as needed
}

const DeviceSchema: Schema = new Schema({
	name: { type: String, required: true },
	type: { type: String, required: true },
	status: { type: String, required: true },
	// Add more fields as needed
});

const Device = mongoose.model<IDevice>('Device', DeviceSchema);
export default Device;
