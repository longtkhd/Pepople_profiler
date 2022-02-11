import { Injectable, Logger } from '@nestjs/common'
import * as dotenv from 'dotenv'
import { join } from 'path'

@Injectable()
export class ConfigurationService {
    private readonly logger = new Logger('ConfigurationService');
    private currentEnv: string = process.env.NODE_ENV || 'development';
    constructor() {
        if (this.currentEnv == 'development') {
            const result = dotenv.config()
            if (result.error) {
                throw result.error
            }
        }

    }
    get(key: string): string {
        return process.env[key]
    }
    get enable_plan_validate(){
        return process.env.enable_plan_validate == '1'
    }
    get asset_url(){
        return process.env.asset_url
    }
    get port(): string | number {
        return process.env.PORT || 3000
    }
    get domain(): string {
        return process.env.domain
    }
    get isDevelopment(): boolean {
        return this.currentEnv === 'development'
    }

    get mongoUri(): string {
        return process.env.MONGO_URI
    }

    get freeTrialDay(): number {
        return Number(process.env.FREE_TRIAL_DAY)
    }
    
    get mothlyDay(): number {
        return Number(process.env.MONTHLY_DAY)
    }

    get timeSendNotification(): number[] {
        const times = process.env.TIME_SEND_NOTIFICATION
        return times.split(',').map(Number) || []
    }
    get cvParsingUsageReaches(): number {
        return Number(process.env.CV_PARSING_REACHES) || 0
    }

    get assementUsageReaches(): number {
        return Number(process.env.ASSESSMENT_REACHES) || 0
    }

    get JWT() {
        return {
            Key: process.env.JWT_KEY || 'DEMO_KEY',
            AccessTokenTtl: parseInt(process.env.ACCESS_TOKEN_TTL, 10) || 60 * 120, // 120m
            RefreshTokenTtl: parseInt(process.env.REFRESH_TOKEN_TTL, 10) || 80 * 120, // 3000 seconds
            authHeaderPrefix: 'JWT',
        }
    }
    get redis_config() {
        return {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        }
    }
    get mailConfig() {
        return {
            from: process.env.mailFrom,
            frontURL: process.env.frontURL,
            front_admin_URL: process.env.front_admin_URL,
            API_DNS:process.env.API_DNS
        }
    }
    get aws() {
        return {
            accessKeyId: process.env.accessKeyId,
            secretAccessKey: process.env.secretAccessKey,
            region: process.env.region,
            bucket: process.env.bucket,
            basePath: process.env.basePath,
            fileSize: 1 * 1024 * 1024,
        }
    }
    get tp_test_config() {
        return {
            base_url: process.env.tp_test_base_url,
            username: process.env.tp_test_username,
            password: process.env.tp_test_password,
            tp_project_key:process.env.TP_PROJECT_KEY,
            TP_PROJECT_NAME:process.env.TP_PROJECT_NAME
        }
    }
    get datrax_config() {
        return {
            base_url: process.env.CVX_SERVER,
            username: process.env.CVX_USERNAME,
        }
    }
    get db() {
        return {
            type: 'mongodb',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            synchronize: false,
            cache: {
                type: 'redis',
                options: {
                    host: process.env.REDIS_HOST,
                    port: process.env.REDIS_PORT,
                },
            },
            entities: [join(__dirname, '../../schemas/*.schema{.ts,.js}')],
        }
    }
}
