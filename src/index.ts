
export const SUBSTITUTION_TAG = (name: string) => `%${name}%`;
export const MATCH_SUBSTITUTION_TAGS = /(%\w+%)/g;

export * from './email';
export * from './styles';
export * from './sendgrid';
import { Email, EmailTemplate } from './email';

// compute all the templates
