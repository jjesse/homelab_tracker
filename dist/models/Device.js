import mongoose, { Schema } from 'mongoose';
const DeviceSchema = new Schema({
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
const Device = mongoose.model('Device', DeviceSchema);
export default Device;
