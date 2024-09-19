import * as dotenv from '@dotenvx/dotenvx';
import * as path from 'path';

class Env {
  
    public constructor() {
        dotenv.config({
            quiet: true
        });
    }

    public get mode(): 'production' | 'development' {
        if (process.env.NODE_ENV === 'production') {
            return 'production';
        }
        return 'development';
    }

    public get dev(): boolean {
        return this.mode === 'development';
    }

    public get port(): number {
        if (!process.env.DEV_PORT) {
            return 3000;
        }
        return Number(process.env.DEV_PORT);
    }

    public get domain(): string {
        if (this.dev) {
            return `localhost:${this.port}`;
        }
        if (!process.env.PROD_HOST) {
            throw new Error('no production host path');
        }
        return process.env.PROD_HOST;
    }

    public get dir(): string {
        return path.join(__dirname, process.env.DEV_DIR || 'dist');
    }

    public get clientID(): string {
        if (!process.env.CLIENT_ID) {
            throw new Error('client id missing');
        }
        return process.env.CLIENT_ID;
    }
    public get tenantID(): string {
        if (!process.env.TENANT_ID) {
            throw new Error('tenant id missing');
        }
        return process.env.TENANT_ID;
    }
    public get clientSecret(): string {
        if (!process.env.CLIENT_SECRET) {
            throw new Error('client secret missing');
        }
        return process.env.CLIENT_SECRET;
    }

}

export default new Env();