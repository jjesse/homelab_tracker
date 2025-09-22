import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	devices: mongoose.Types.ObjectId[];
	date?: Date;
}

const UserSchema: Schema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	date: { type: Date, default: Date.now },
	devices: [{ type: Schema.Types.ObjectId, ref: 'Device' }]
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
