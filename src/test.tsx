import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Email, EmailTemplate } from './email';
import { Stylesheet, Stylesheets } from './styles';

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
    content: (<React.Fragment>
        <Styles3/>
        <div>
            eeey
        </div>
    </React.Fragment>)
})
console.log(a);
a.render().then(console.log);