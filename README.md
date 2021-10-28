
This package provides a simple interface to send emails for HacKSU and Kent Hsck Enough.

Supports email templates, React JSX, markdown, Sass, and more.

## Example Usage
```tsx
import { Email, EmailTemplate, Stylesheet, Sendgrid, SUBSTITUTION_TAG } from '@hacksu/email';

// used to deliver Email objects as actual mail
const SendgridDelivery = new Sendgrid('SENDGRID_API_KEY', {
    // sendgrid mail parameters
    // these will get applied to each email sent through this instance
    from: 'mail@hacksu.com',
})


// Including stylesheets in react emails
const HacksuMailingStyles = Stylesheet('@email/welcome.scss') 
// @email/... refers to @hacksu/email/src/styles/...
// You can also pass in relative paths that will be relative to current script

// Stylesheets can also be merged together and stringified
const SomeStyles = Stylesheet(
    Stylesheet('./style.scss') + HacksuMailingStyles
);


// deliver a markdown email
SendgridDelivery.send(new Email({
    from: "mail@hacksu.com',
    to: 'test@example.com',
    subject: "hi there!",
    content: `
# Title 1
## Title 2
Content

<a href="%unsubscribe%">unsubscribe</a>
    `
}))


// react JSX email template
// substitution tags are %field%, or SUBSTITUTION_TAG(field)
const WelcomeTemplate = EmailTemplate({
    subject: "Welcome to HacKSU!",
    content: (<div>
        <HacksuMailingStyles/>
        <h1>Hey %name%! %subject</h1>
        <a href={SUBSTITUTION_TAG('unsubscribe')}>
            unsubscribe from our emails
        </a>
    </div>)
})

// deliver the email
SendgridDelivery.send(new WelcomeTemplate({
    to: 'joe@example.com',
    name: 'Joe',
}), {
    // sendgrid fields (such as from, to, subject)
    // can also be applied here rather than directly
    // on the email instance itself
})
```