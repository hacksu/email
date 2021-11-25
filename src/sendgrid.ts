import { MailService } from '@sendgrid/mail';
import { MailData, MailDataRequired } from '@sendgrid/helpers/classes/mail';
import { Email } from './email';
import { SUBSTITUTION_TAG } from '.';

const NO_SEND = false;

type Partial<T> = {
    [P in keyof T]?: T[P];
};

export class Sendgrid {
    service: MailService;
    defaultPayload?: Partial<MailData>;

    constructor(apiKey: string, defaultPayload?: Partial<MailData>) {
        this.service = new MailService();
        this.service.setApiKey(apiKey);
        if (defaultPayload) {
            this.defaultPayload = defaultPayload;
        }
    }

    async send(mail: Email, additionalPayload?: Partial<MailData>, options?: {
        text: boolean
    }) {
        // @ts-ignore
        let payload: MailDataRequired = Object.assign({ ...mail },
            (this.defaultPayload || {})
        );
        Object.setPrototypeOf(payload, mail);
        // if (options && options.text) 
        payload.text = await mail.render('text');
        payload.html = await mail.render();
        payload.trackingSettings = {
            subscriptionTracking: {
                enable: true,
                substitutionTag: SUBSTITUTION_TAG("unsubscribe")
            }
        }
        if (additionalPayload) Object.assign(payload, additionalPayload);
        console.log(payload);
        if (NO_SEND) return "Sending is disabled";
        return this.service.send(payload as MailDataRequired);
    }
}

