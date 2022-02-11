import { IsString } from 'class-validator';

export class AddTimeDto {
    @IsString()
    candidate_id: string;
    @IsString()
    time_id: string;
    @IsString()
    info: string;
}
