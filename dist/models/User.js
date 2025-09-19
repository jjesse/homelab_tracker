import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    // Add more fields as needed
});
const User = mongoose.model('User', UserSchema);
export default User;
