import { PublishCommand, PublishCommandOutput, SNSClient } from "@aws-sdk/client-sns";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

const REGION = "eu-west-2";

const snsClient = new SNSClient({
    region: REGION,
    credentials: fromCognitoIdentityPool({
        identityPoolId: "eu-west-2:1a85b99c-be4b-42fe-a90d-500a68f1c680",
        clientConfig: { region: REGION },
    }),
});

export const SEND_AGAIN_DELAY = 5; // in seconds

function isBlank(str: string) {
    return !str || /^\s*$/.test(str); // \s matches white space characters
}

let lastSendTime = 0;

export const sendMessage = async ({
    name,
    contact,
    userMessage,
}: {
    name?: string;
    contact?: string;
    userMessage?: string;
}): Promise<PublishCommandOutput> => {
    console.log("Sending message");
    console.log({ name, contact, userMessage });

    if (!userMessage || isBlank(userMessage)) {
        throw new Error("Message is empty");
    }

    if (Date.now() - lastSendTime < SEND_AGAIN_DELAY * 1000) {
        throw new Error(`Message sent too fast.`);
    }

    const message = `Name:\n${name}\n\nMessage:\n${userMessage}\n\nContact:\n${contact}`;

    const params = {
        Subject: "Message via Personal Website",
        Message: message,
        TopicArn: "arn:aws:sns:eu-west-2:969374931219:personal-website-message",
    };
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sns/classes/publishcommand.html
    const command = new PublishCommand(params);

    lastSendTime = Date.now();
    const data = await snsClient.send(command);
    if (data.$metadata.httpStatusCode == 200) {
        return data;
    } else {
        throw new Error(`Message failed to send\nStatus Code: ${data.$metadata.httpStatusCode}`);
    }
};
