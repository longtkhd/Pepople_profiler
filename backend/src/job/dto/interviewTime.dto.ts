import { Transform, Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class InterviewTimeDto {
    @Transform(() => Date)
    @Type(() => Date)
    @IsDate()
    date: Date;
    @IsDate()
    time_start: Date;
    @IsDate()
    time_end: Date;
    time_zone: string;
}
