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

function isBlank(str: string) {
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

export async function sendMessage(
    userName: string,
    userEmail: string,
    userMessage: string
): Promise<[MessageStatusType, string[]]> {
    const errorMessage: string[] = [];
    
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

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: userName,
                contact: userEmail,
                message: userMessage,
            }),
        });
        const data = await response.json();
        if (!response.ok) {
            return ['ERROR', [data.error || 'Message failed to send']];
        }
        return ['SUCCESS', [`Message ID: ${data.id}`]];
    } catch (error) {
        console.log(error);
        return ['ERROR', [`Internal Error: ${error}`]];
    }
}
