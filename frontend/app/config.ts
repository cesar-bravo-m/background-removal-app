'use server'
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

export const config = {
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL
}