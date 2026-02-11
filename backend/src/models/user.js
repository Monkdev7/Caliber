import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 120,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        passwordHash: {
            type: String,
            required: true,
            select: false,
        },
        refreshTokenHash: {
            type: String,
            select: false,
        },
        refreshTokenExpiresAt: {
            type: Date,
        },
        passwordResetTokenHash: {
            type: String,
            select: false,
        },
        passwordResetExpiresAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    },
);

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.passwordHash);
};

export default model('User', userSchema);
