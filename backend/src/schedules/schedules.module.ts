import { forwardRef, Module } from '@nestjs/common'
import { SchedulesService } from './schedules.service'
import { ScheduleModule } from '@nestjs/schedule'
import { AgencyModule } from 'src/agency/agency.module'
import { CandidateModule } from 'src/candidate/candidate.module'
import { NotificationModule } from '../notification/notification.module'

@Module({
    imports: [ScheduleModule.forRoot(),
        CandidateModule,
        forwardRef(() => AgencyModule),
        forwardRef(() => NotificationModule)
    ],
    providers: [SchedulesService]
})
export class SchedulesModule { }
