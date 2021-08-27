//////////////////////////////////////////////////////////////////////
// kirudev serverless functions
// refer to following URL for 
// https://firebase.google.com/docs/functions/typescript
// -----
// Copyright (c) Kiruse 2021. Licensed under GPL-3.0
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { config } from 'firebase-functions';
import * as nodemailer from 'nodemailer';

import * as errors from './errors.json';
import * as blacklist from './blacklist.json';

admin.initializeApp();

interface MailConfig {
    user: string;
    pass: string;
}
interface MailBody {
    sender: string;
    subject: string;
    msg: string;
}

const mailConf = config().mail as MailConfig;
const mailTransport = nodemailer.createTransport({
    host: 'smtp.porkbun.com',
    port: 587,
    auth: {
        user: mailConf.user,
        pass: mailConf.pass,
    },
});
const rxEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export const sendmail = functions.region('europe-west1').https.onRequest(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin(req.headers.origin));
    
    if (!req.accepts('application/x-www-form-urlencoded', 'multipart/form-data')) {
        res.status(406).end();
        return;
    }
    
    const {sender, subject, msg: content} = req.body as MailBody;
    if (sender === undefined || subject === undefined || content === undefined) {
        res.status(500).end();
        return;
    }
    
    if (!sender.match(rxEmail)) {
        res.status(200).json({error: errors.mail['malformed address']}).end();
        return;
    }
    // silently ignore these, leaving them think it succeeded
    if (isBlacklistAddress(sender) || mailfilter(subject, content)) {
        res.status(200).end();
        return;
    }
    
    const msg = {
        from: 'kiruse@kiruse.com',
        sender: sender + '',
        replyTo: sender + '',
        to: 'kiruse@kiruse.dev',
        subject: 'On-site message: ' + subject,
        text: `Received a message from ${sender}:\n\n${content}`,
    };
    mailTransport.sendMail(msg, (err, info) => {
        if (err) {
            functions.logger.error('sendmail failed', err);
            res.status(500).end();
        }
        else {
            functions.logger.info('sendmail success', info);
            res.status(200).end('{}');
        }
    });
});


function allowedOrigin(origin?: string): string {
    if (config().general.debug === 'true') {
        if (origin?.match?.(/^https?:\/\/localhost/)) {
            return origin;
        }
    }
    if (origin?.match?.(/^https:\/\/(.+\.)*kiruse\.dev/)) {
        return origin;
    }
    return 'https://kiruse.dev';
}

function isBlacklistAddress(addr: string): boolean {
    const blacklisted = (blacklist.mail.addresses as string[]).map(addr => addr.toLowerCase());
    return blacklisted.indexOf(addr.toLowerCase().trim()) !== -1;
}

function mailfilter(subject: string, content: string): boolean {
    const blacklisted = blacklist.mail.terms as string[];
    subject = subject.toLowerCase();
    content = content.toLowerCase();
    
    for (let term of blacklisted) {
        if (subject.includes(term) || content.includes(term)) {
            return true;
        }
    }
    return false;
}
