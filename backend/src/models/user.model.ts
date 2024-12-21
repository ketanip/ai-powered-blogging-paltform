import argon2 from "argon2";
import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createdOn: Date;
    updatedOn: Date;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        createdOn: { type: Date, default: Date.now },
        updatedOn: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

UserSchema.pre('save', async function (next) {

    const rawThis: any = this;
    const user = rawThis as IUser;

    if (!user.isModified('password')) {
        next();
        return;
    }

    try {
        user.password = await argon2.hash(user.password);
        next();
    } catch (error: any) {
        next(error);
    }

});


const UserModel = mongoose.model<IUser>('User', UserSchema);
export default UserModel;
export { IUser };