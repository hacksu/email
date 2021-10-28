import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Email, EmailTemplate } from './email';
import { Stylesheet, Stylesheets } from './styles';
import { useContext } from 'react';

let thing1 = EmailTemplate({
    subject: "hi there"
})
let thing2 = EmailTemplate({
    subject: "woooah"
})

const Styles = Stylesheet( // adding stylesheets
    Stylesheet('./styles/test.css')
    +
    Stylesheet('./styles/test2.scss')
);
const Styles2 = Stylesheet( // adding filenames
    './styles/test.css'
    +
    './styles/test2.scss'
);
const Styles3 = Stylesheets([ // array filenames
    '@email/test.css', // refering to @hacksu/email/styles instead of relative
    './styles/test2.scss',
])
let a = new thing1({
    // content: (<React.Fragment>
    //     <Styles3/>
    //     <div>
    //         eeey
    //     </div>
    // </React.Fragment>)
    content: function({ email }: { email: Email }) {
        return (<React.Fragment>
            <Styles3/>
            <div>
                eeeeeeeeey, {email.subject}, %subject%
                <br></br>
                <a href="%unsubscribe%">unsubscribe</a>
            </div>
        </React.Fragment>)
    }
})
console.log(a);
a.render().then(console.log);

let b = new thing2({
    content: `# hey there
    woah`
});
b.render().then(console.log);
b.render('text').then(console.log);

import { Sendgrid } from './sendgrid';

const { sendgridToken } = require('../secrets.js');
// console.log({ sendgridToken })
const KHEMailer = new Sendgrid(sendgridToken, {
    from: {
        email: "test@khe.io",
        name: "Test",
    },
    replyTo: {
        email: "staff@khe.io",
        name: "Staff"
    }
})


KHEMailer.send(a, {
    to: "cseitz5@kent.edu"
}).then(console.log).catch(err => console.error(err))

