
import { renderToStaticMarkup } from 'react-dom/server';


export interface EmailArguments {
    subject?: string;
    template?: any;
    [key: string]: any;
}

export class Email {
    [key: string]: any;

    constructor(args: EmailArguments, args2?: EmailArguments) {
        Object.assign(this, args);
        if (args2) Object.assign(this, args2);
    }
    async render() {
        let contents = (this.content || this.template);
        if (contents instanceof Function) {
            contents = contents.call(this);
        }
        if (contents instanceof Promise) {
            contents = await contents;
        }
        return renderToStaticMarkup(contents);
    }
}

export function EmailTemplate(args: EmailArguments) {
    // let TemplatedEmail = function(this: Email, args2: EmailArguments) {
    //     Email.call(this, Object.assign({ ...args }, args2))
    // }
    // // Object.setPrototypeOf(TemplatedEmail, Email);
    // console.log(TemplatedEmail.prototype);
    // TemplatedEmail.prototype = Email;
    // console.log(TemplatedEmail.prototype);
    let TemplatedEmail = Email.bind(Email, args);
    return TemplatedEmail;
}