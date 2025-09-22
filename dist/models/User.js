import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },
    devices: [{ type: Schema.Types.ObjectId, ref: 'Device' }]
});
const User = mongoose.model('User', UserSchema);
export default User;
