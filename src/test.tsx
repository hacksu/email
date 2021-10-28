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

const Styles = Stylesheet(
    Stylesheet('./styles/test.scss')
    +
    Stylesheet('./styles/test2.scss')
);
const Styles2 = Stylesheet(
    './styles/test.scss'
    +
    './styles/test2.scss'
);
const Styles3 = Stylesheets([
    './styles/test.scss',
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