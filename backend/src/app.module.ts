import { DaxtraIntegrationModule } from './daxtra.Integration/daxtra-integration.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'

import { AwsSdkModule } from 'nest-aws-sdk'
import { SES, S3, Credentials } from 'aws-sdk'
import { Module } from '@nestjs/common'

import { connectionString } from 'orm.config'
import { CsvModule } from 'nest-csv-parser'
import { CandidateModule } from './candidate/candidate.module'
import { ClientModule } from './client/client.module'
import { JobModule } from './job/job.module'
import { RecruiterModule } from './recruiter/recruiter.module'
import { AgencyModule } from './agency/agency.module'
import { AdminModule } from './admin/admin.module'
import { AwsModule } from './aws/aws.module'
import { TokenModule } from './token/token.module'
import { MailModule } from './mail/mail.module'
import { MailTemplateModule } from './mailTemplate/mailtemplate.module'
import { SharedModule } from './shared/shared.module'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { TypegooseModule } from 'nestjs-typegoose'
import { ConfigurationService } from './shared/configuration/configuration.service'
//import { AutomapperModule } from 'nestjsx-automapper/dist/automapper.module';
//import { Users } from './schemas/user.schema';
import { PackageModule } from './package/package.module'
import { SchedulesModule } from './schedules/schedules.module'
import { ProjectAssessmentModule } from './projectAssessment/projectAssessment.module'
import { NotificationModule } from './notification/notification.module'
import { AppGateway } from './app.gateway'
import { InterviewTimeModlue } from './interviewTime/interviewTime.module'

@Module({
    imports: [
        DaxtraIntegrationModule,
        CsvModule,
        TypegooseModule.forRoot(connectionString.uri, connectionString.options),
        AwsModule,
        AwsSdkModule.forRootAsync({
            defaultServiceOptions: {
                useFactory: (config: ConfigurationService) => {
                    return {
                        region: config.aws.region,
                        credentials: new Credentials(
                            config.aws.accessKeyId,
                            config.aws.secretAccessKey,
                        ),
                    }
                },
                imports: [ConfigurationService],
                inject: [ConfigurationService],
            },
            services: [S3, SES],
        }),
        TokenModule,
        MailModule,
        //AutomapperModule.withMapper(),
        MailTemplateModule,
        CandidateModule,
        ClientModule,
        JobModule,
        RecruiterModule,
        // MulterExtendedModule.registerAsync({
        //   useFactory: (config: ConfigurationService) => config.s3,
        //   inject: [ConfigurationService],
        // }),
        AgencyModule,
        AdminModule,
        SharedModule,
        ProjectAssessmentModule,
        UserModule,
        AuthModule,
        PackageModule,
        SchedulesModule,
        NotificationModule,
        InterviewTimeModlue
    ],
    controllers: [AppController],
    providers: [
        AppService,
        AppGateway
    ],
    exports: [AppGateway]
})
export class AppModule {
    static port: number | string;
    static isDev: boolean;

    constructor(private readonly _configurationService: ConfigurationService) {
        AppModule.port = AppModule.normalizePort(_configurationService.port)
        AppModule.isDev = _configurationService.isDevelopment
    }

    /**
     * Normalize port or return an error if port is not valid
     * @param val The port to normalize
     */
    private static normalizePort(val: number | string): number | string {
        const port: number = typeof val === 'string' ? parseInt(val, 10) : val

        if (Number.isNaN(port)) {
            return val
        }

        if (port >= 0) {
            return port
        }

        throw new Error(`Port "${val}" is invalid.`)
    }
}
