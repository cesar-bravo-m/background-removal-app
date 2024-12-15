'use server'
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

export const config = {
    backendUrl: process.env.BACKEND_URL || 'http://localhost:5000'
}