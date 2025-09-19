import mongoose, { Schema } from 'mongoose';
const DeviceSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    // Add more fields as needed
});
const Device = mongoose.model('Device', DeviceSchema);
export default Device;
