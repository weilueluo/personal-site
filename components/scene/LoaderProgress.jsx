import { useProgress } from "@react-three/drei";
import { Html } from "next/document";
import { useState } from "react";
import { DefaultLoadingManager } from "three";
import styles from './LoaderProgress.module.sass'

export default function LoaderProgress() {
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(0);
    const [loadingUrl, setLoadingUrl] = useState("");
    const [complete, setComplete] = useState(true);
    const [error, setError] = useState(null);

    DefaultLoadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
        console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        setCurrent(itemsLoaded);
        setLoadingUrl(url);
        setTotal(itemsTotal);
        setComplete(itemsLoaded == itemsTotal);
    };

    DefaultLoadingManager.onLoad = function () {
        console.log('Loading Complete!');
        setComplete(true);
    };

    DefaultLoadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
        console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        setCurrent(itemsLoaded);
        setLoadingUrl(url);
        setTotal(itemsTotal);
        setComplete(itemsLoaded == itemsTotal);
    };

    DefaultLoadingManager.onError = function (url) {
        console.log('There was an error loading ' + url);
        setError(url);
        setComplete(false)
    };

    return (
        complete ? null : (
            <div className={styles.loader}>
                Loading {current} / {total} <br />
                {loadingUrl}<br/>
                {error || ""}
            </div>
        )
    )
}