import { prop } from '@typegoose/typegoose'

export class NotificationSetting {
    @prop() type: number;
    @prop() notify: string;
    @prop() by_website: boolean;
    @prop() by_email: boolean;
}