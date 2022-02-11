import { Injectable } from '@nestjs/common';
import { JwtPayload } from 'src/auth/dto/login';
import { MailService } from 'src/mail/mail.service';
import { ClientContact } from 'src/schemas/client.schema';

@Injectable()
export class InterviewNotifi {
    constructor(private readonly mailService: MailService) {}
    async sendNotificationInterview(
        payload: JwtPayload,
        time: any,
        candidate,
        client,
        title,
    ) {
        var moment = require('moment-timezone');
        console.log(time);
        let contentToCandidate = `You have a interview with <b>${payload.first_name}
        </b> on <b>${moment(time.date).tz(time.time_zone).format('DD/MM/YYYY')}</b>, 
        this is start on <b>${moment( time.time_start).tz(time.time_zone).format('HH:mm A')} 
        </b>(GMT ${moment.tz(time.time_zone).utcOffset() / 60}:00) ${time.time_zone} and close on 
        <b>${moment(time.time_end).tz(time.time_zone).format('HH:mm A',)}
        </b>(GMT ${moment.tz(time.time_zone).utcOffset() / 60}:00) ${time.time_zone}. 
        If you have any queries, please contact me on <b>${ payload.phone_number || ' '}</b>. 
        Otherwise, I look forward to meeting you to discuss thanks!<br>`;
        // to client
        let contentToClientContact = `You have a interview with <b>
        ${candidate.candidate_name ? candidate.candidate_name : ' '}
        </b> on <b> ${moment(time.date).tz(time.time_zone).format('DD/MM/YYYY')} 
        </b>, this is start on <b> ${moment(time.time_start).tz(time.time_zone).format('HH:mm A')}
        </b>(GMT ${moment.tz(time.time_zone).utcOffset() / 60}:00) ${time.time_zone} 
        and close on <b>
        ${moment(time.time_end).tz(time.time_zone).format('HH:mm A')}
        </b> (GMT ${moment.tz(time.time_zone).utcOffset() / 60}:00) ${time.time_zone}.
        If you have any queries, please contact me on <b>${payload.phone_number || ' '}</b>. 
        Otherwise, I look forward to meeting you to discuss thanks!<br>`;

        const infomation = `Addition infomation: ${time.info}.`;
        if (time.info != null && time.info.length > 0) {
            contentToCandidate += infomation;
            contentToClientContact += infomation;
        }
        // send notifi
        await this.mailService.SendNotification(
            {
                first_name: candidate.candidate_name
                    ? candidate.candidate_name
                    : ' ',
                id: candidate._id,
                email: candidate.candidate_email,
            },
            {
                title: title,
                content: contentToCandidate,
            },
        );
        await this.mailService.SendNotification(client, {
            title: title,
            content: contentToClientContact,
        });
    }
    async sendPostpone(client, candidate) {
        let title = 'Postpone Interview';
        let contentToCandidate = `You have an interview with <b>${client.first_name}</b>, but for some reason, it has been postponed. We will notify you as soon as the latest announcement is available. Thanks!`;
        let contentToClientContact = `You have an interview with <b>${candidate.candidate_name}</b>, but for some reason, it has been postponed. We will notify you as soon as the latest announcement is available. Thanks!`;
        await this.mailService.SendNotification(
            {
                first_name: candidate.candidate_name
                    ? candidate.candidate_name
                    : 'undefined',
                id: candidate._id,
                email: candidate.candidate_email,
            },
            {
                title: title,
                content: contentToCandidate,
            },
        );
        await this.mailService.SendNotification(client, {
            title: title,
            content: contentToClientContact,
        });
    }
}
