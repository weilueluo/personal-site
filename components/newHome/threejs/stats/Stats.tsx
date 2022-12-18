import styles from './Stats.module.sass';
import { Stats } from '@react-three/drei';

export default function ThreeJsStats() {
    return (
        <>
            <Stats showPanel={0} className={styles.panel1} />
            <Stats showPanel={1} className={styles.panel2} />
            <Stats showPanel={2} className={styles.panel3} />
        </>
    );
}
