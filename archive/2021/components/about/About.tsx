"use client";

import { useEffect, useState } from 'react';
import type { ChangeEvent, ReactNode, Dispatch, SetStateAction } from 'react';
import { getBuildTime, timeSince } from '../common/misc';
import styles from './About.module.sass';
import {
    MessageStatus,
    MessageStatusType,
    SEND_AGAIN_DELAY,
    sendMessage,
} from './MessageHandler';

const iconSize = 48;

type IconListItemProps = {
    url?: string;
    src: string;
    caption?: string;
};

function IconListItem({ url = '#', src, caption }: IconListItemProps) {
    const captionNode = <span>{caption}</span>;
    return (
        <a href={url} className={styles['list-item-link']}>
            <li className={styles['list-item']}>
                {/* eslint-disable-next-line */}
                <img
                    src={src}
                    height={iconSize}
                    width={iconSize}
                    alt={`${caption || 'icon'} icon`}
                />
            </li>
            {caption && captionNode}
        </a>
    );
}

function Title({ children }: { children: ReactNode }) {
    return <h1 className={styles['title']}>{children}</h1>;
}

function SubTitle({ children }: { children: ReactNode }) {
    return <h2 className={styles['sub-title']}>{children}</h2>;
}

function List({ children }: { children: ReactNode }) {
    return <ul className={styles['list']}>{children}</ul>;
}

function BuildTime() {
    const buildTime = new Date(getBuildTime());

    return (
        <span className={styles['build-time']}>
            This website is updated {timeSince(new Date(), buildTime)} ago.
            <br />
            Build time: {buildTime.toLocaleString()}.
        </span>
    );
}

type MessageStatusValue = [MessageStatusType, string[]];
type MessageStatusState = [MessageStatusValue, Dispatch<SetStateAction<MessageStatusValue>>];

// drop a message
function MessageResponse({ status }: { status: MessageStatusState }) {
    const statusCode = status[0][0];
    const setStatus = status[1];

    if (statusCode == 'IDLE') {
        return <></>;
    }

    const displayStatus = MessageStatus[statusCode];
    const displayMessage = status[0][1].map((ele, i) => (
        <div key={i}>
            {ele}
            <br />
        </div>
    ));

    const closeOnClick = () => setStatus(['IDLE', []]);

    return (
        <div className={styles['message-response-container']}>
            <h2 className={styles['message-status']}>{displayStatus}</h2>
            <span className={styles['message-response']}>{displayMessage}</span>
            <button className={styles['close-button']} onClick={closeOnClick}>
                Close
            </button>
        </div>
    );
}

function DropAMessage() {
    const [userMessage, setUserMessage] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');

    const userMessageChanged = (e: ChangeEvent<HTMLTextAreaElement>) => setUserMessage(e.target.value);
    const userEmailChanged = (e: ChangeEvent<HTMLInputElement>) => setUserEmail(e.target.value);
    const userNameChanged = (e: ChangeEvent<HTMLInputElement>) => setUserName(e.target.value);

    const [sendStatus, setSendStatus] = useState<[MessageStatusType, string[]]>(
        ['IDLE', []],
    );

    const [sendButton, setSendButton] = useState<HTMLButtonElement | null>(null);
    useEffect(() => {
        setSendButton(
            document.getElementById('send-button') as HTMLButtonElement,
        );
    }, []);

    const interval = 0.05; // update display interval, in seconds
    const [countDownSeconds, setCountDownSeconds] = useState(0);
    useEffect(() => {
        const disableSendButton = () =>
            sendButton && (sendButton.disabled = true);
        const enableSendButton = () =>
            sendButton && (sendButton.disabled = false);

        if (countDownSeconds <= 0) {
            enableSendButton();
        } else {
            const nextInterval = interval + Math.random() * 0.05; // add some randomness so that it looks more interesting
            disableSendButton();
            setTimeout(() => {
                setCountDownSeconds(countDownSeconds - nextInterval);
            }, nextInterval * 1000);
        }
    }, [countDownSeconds, sendButton]);

    const sendMessageOnClick = async () => {
        console.log(userName);
        console.log(userEmail);
        console.log(userMessage);

        setSendStatus(['IN_PROGRESS', []]);
        const [status, response] = await sendMessage(
            userName,
            userEmail,
            userMessage,
        );
        setSendStatus([status, response]);

        setCountDownSeconds(SEND_AGAIN_DELAY);
    };

    return (
        <div className={styles['drop-a-message-container']}>
            <textarea
                id="user-message"
                className={styles['message-textarea']}
                onChange={userMessageChanged}></textarea>
            <div className={styles['name-area']}>
                <span className={styles['name-tag']}>Name</span>
                <input
                    id="user-name"
                    className={styles['name-input']}
                    type="text"
                    onChange={userNameChanged}
                />
            </div>
            <div className={styles['email-area']}>
                <span className={styles['email-tag']}>Email</span>
                <input
                    id="user-email"
                    className={styles['email-input']}
                    type="text"
                    onChange={userEmailChanged}
                />
            </div>
            <button
                id="send-button"
                className={styles['send-button']}
                onClick={sendMessageOnClick}>
                {countDownSeconds <= 0 ? 'Send' : countDownSeconds.toFixed(2)}
            </button>

            <MessageResponse status={[sendStatus, setSendStatus]} />
        </div>
    );
}

export default function About() {
    return (
        <>
            <div className={styles['container']}>
                {/* <UnderDevelopment /> */}

                {/* <Title>About</Title> */}

                <SubTitle>tech stack</SubTitle>
                <List>
                    <IconListItem
                        src="/icons/tech/javascript.svg"
                        url="https://www.javascript.com/"
                    />
                    <IconListItem
                        src="/icons/tech/typescript.svg"
                        url="https://www.typescriptlang.org/"
                    />
                    <IconListItem
                        src="/icons/tech/react.svg"
                        url="https://reactjs.org/"
                    />
                    <IconListItem
                        src="/icons/tech/threejs.svg"
                        url="https://threejs.org/"
                    />
                    <IconListItem
                        src="/icons/tech/nextdotjs.svg"
                        url="https://nextjs.org/"
                    />
                    <IconListItem
                        src="/icons/tech/sass.svg"
                        url="https://sass-lang.com/"
                    />
                </List>

                <SubTitle>deployment</SubTitle>
                <List>
                    <IconListItem
                        src="/icons/tech/amazonaws.svg"
                        url="https://aws.amazon.com/"
                    />
                </List>

                <SubTitle>source code</SubTitle>
                <List>
                    <IconListItem
                        src="/icons/tech/github.svg"
                        url="https://github.com/Redcxx/personal-website"
                    />
                </List>

                <SubTitle>email</SubTitle>
                <List>
                    <IconListItem
                        src="/icons/tech/gmail.svg"
                        url="mailto:luoweilue@gmail.com"
                        caption="luoweilue@gmail.com"
                    />
                </List>

                <SubTitle>message</SubTitle>
                <DropAMessage />
            </div>

            {/* Note this cause render content between server and client to differ */}
            <BuildTime />
        </>
    );
}

// export async function getStaticProps() {
//    const buildTime =

//     return {
//       props: {
//         buildTime,
//       },
//     }
//   }
