
'use client'

import { ConnectKitButton } from "connectkit";
import styles from "./Navbar.module.css";
export default function Navbar() {
  return (
    <nav className={styles.navbar}>
        <p>OOPS! Coin Collectors</p>
      <ConnectKitButton />
    </nav>
  );
}
