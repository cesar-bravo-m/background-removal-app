'use server'
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());
console.log("### ", process.env.BACKEND_URL);