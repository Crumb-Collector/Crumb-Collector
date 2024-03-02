
"use client";

import ConnectButton from "@/components/connect-button";
import styles from "./Navbar.module.css";
export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <p>OOPS! Coin Collectors</p>
      <ConnectButton />
    </nav>
  );
}
