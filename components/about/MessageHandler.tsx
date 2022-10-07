import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import React, { ReactElement } from 'react';

const REGION = 'eu-west-2'; // do not change unless you know what you doing

const cognitoClient = new CognitoIdentityClient({ region: REGION });

const snsClient = new SNSClient({
    region: REGION,
    credentials: fromCognitoIdentityPool({
        identityPoolId: 'eu-west-2:1a85b99c-be4b-42fe-a90d-500a68f1c680',
        clientConfig: { region: REGION }
    }),
});

const TOPIC_ARN = 'arn:aws:sns:eu-west-2:969374931219:personal-website-message'
export const SEND_AGAIN_DELAY = 5

export const MessageStatus = {
    IDLE: '',
    IN_PROGRESS: 'Sending...',
    SUCCESS: 'Success',
    ERROR: 'Error',
    BLOCKED: 'Blocked',
    INVALID: 'Invalid'
}
export type MessageStatusType = keyof typeof MessageStatus;

function isBlank(str) {
    return (!str || /^\s*$/.test(str)); // \s matches white space characters
}

// https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
function isValidEmail(email: string) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
}

export async function sendMessage(userName: string, userEmail: string, userMessage: string): Promise<[MessageStatusType, string[]]> {
    let errorMessage = [];
    
    if (isBlank(userMessage)) {
        errorMessage.push('Message is empty')
    }
    if (isBlank(userName)) {
        errorMessage.push('Name is empty')
    }
    if (isBlank(userEmail)) {
        errorMessage.push('Email is empty')
    } else if (!isValidEmail(userEmail)) {
        errorMessage.push('Email is not well-formed')
    }

    if (errorMessage.length >= 1) {
        return ['INVALID', errorMessage];
    }

    const message = `${userName}\n\n${userMessage}\n\n${userEmail}`

    const params = {
        Subject: 'Message via Personal Website',
        Message: message,
        TopicArn: TOPIC_ARN,
    }
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sns/classes/publishcommand.html
    const command = new PublishCommand(params);
    try {
        const data = await snsClient.send(command);
        if (data.$metadata.httpStatusCode == 200) {
            // TODO: if response succeed send a confirmation email to their email address
            // see: https://aws.amazon.com/getting-started/hands-on/send-an-email/
            return ['SUCCESS', [`Message ID: ${data.MessageId}`]];
        } else {
            return ['ERROR', [`Message failed to send\nStatus Code: ${data.$metadata.httpStatusCode}`]];
        }
    } catch (error) {
        console.log(error);
        return ['ERROR', [`Internal Error: ${error}`]];
    }
}