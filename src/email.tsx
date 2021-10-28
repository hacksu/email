
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { isValidElement } from 'react';
import marked from 'marked';
import { convert as html2text } from 'html-to-text';
import React from 'react';
import { MATCH_SUBSTITUTION_TAGS } from '.';

export interface EmailArguments {
    subject?: string;
    template?: any;
    [key: string]: any;
}

enum RenderMethod {
    html = "html",
    text = "text",
}

type Partial<T> = {
    [P in keyof T]?: T[P];
};

export class Email {
    [key: string]: any;

    constructor(args: EmailArguments, args2?: EmailArguments) {
        Object.assign(this, args);
        if (args2) Object.assign(this, args2);
    }
    async render(method: 'html' | 'text' = 'html') {
        let contents = (this.content || this.template);
        let contents_ = contents;
        let isReact = false;
        if (contents instanceof Promise) contents = await contents;
        if (contents instanceof Function) {
            isReact = String(contents).includes('createElement(');
            if (!isReact) {
                contents = contents.call(this);
                if (contents instanceof Promise) contents = await contents;
            }
        }
        isReact = isReact || isValidElement(contents);
        let Contents = contents;
        if (isReact) {
            Contents = contents_;
        }
        let html;
        if (isReact) {
            html = renderToStaticMarkup(<Contents email={this}/>);
        } else {
            html = marked(contents);
        }
        let result = html;
        if (method == 'text') {
            result = html2text(html, {
                wordwrap: 130
            })
        }
        const email = this;
        const tags = result.split(MATCH_SUBSTITUTION_TAGS)
        .map((tag: string) => {
            if (MATCH_SUBSTITUTION_TAGS.test(tag)) {
                console.log({ tag })
                let tagContent = tag.match(/\w+/)?.[0];
                if (tagContent && tagContent in email) {
                    return email[tagContent];
                }
            }
            return tag;
        });
        // console.log(result.split(MATCH_SUBSTITUTION_TAGS));
        return tags.join('');
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