import { m } from "@/shared/css";
import { L_FONT } from "@/shared/fonts";
import { BaseProps } from "@/shared/types/react";
import { FaApple } from "react-icons/fa";
import { GiChewedHeart, GiClover, GiRss } from "react-icons/gi";
import { AiOutlineContacts } from "react-icons/ai";
import { IoLayers, IoLayersSharp } from "react-icons/io5";
import { ImStack } from "react-icons/im";
import { CgYinyang } from "react-icons/cg";
import { HiAcademicCap } from "react-icons/hi";
import { RiContactsBook2Fill, RiContactsBook2Line, RiFilePaper2Fill, RiFilePaper2Line } from "react-icons/ri";
import { SiGithub } from "react-icons/si";
import styles from './Header.module.scss';

export default function Header(props: BaseProps) {
  return (
    <header className={m(styles.header, L_FONT.className)}>
      <nav className={styles.nav}>
        <ul className={styles.list}>
          <li className={styles.item}>
            <HiAcademicCap />
            <h3>LUOWEILUE</h3>
          </li>
        </ul>
        <ul className={styles.list}>
          <li className={styles.item}>
            <SiGithub />
            Source
          </li>
          <li className={styles.item}>
            <RiFilePaper2Fill /> Blogs
          </li>
          <li className={styles.item}>
            <RiContactsBook2Fill />
            Contact
          </li>
          <li className={styles.item}>
            <GiClover />
            Anime
          </li>
          <li className={styles.item}>
            <IoLayers />
            RSS
          </li>
        </ul>
      </nav>
    </header>
  );
}
