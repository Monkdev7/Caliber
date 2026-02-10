import { z } from 'zod';

export const passwordRules = [
    {
        label: 'At least 8 characters',
        test: value => value.length >= 8,
    },
    {
        label: 'One uppercase letter',
        test: value => /[A-Z]/.test(value),
    },
    {
        label: 'One lowercase letter',
        test: value => /[a-z]/.test(value),
    },
    {
        label: 'One number',
        test: value => /\d/.test(value),
    },
    {
        label: 'One special character',
        test: value => /[^A-Za-z0-9]/.test(value),
    },
];

export const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .regex(/[A-Z]/, 'Password must include an uppercase letter.')
    .regex(/[a-z]/, 'Password must include a lowercase letter.')
    .regex(/\d/, 'Password must include a number.')
    .regex(/[^A-Za-z0-9]/, 'Password must include a special character.');
