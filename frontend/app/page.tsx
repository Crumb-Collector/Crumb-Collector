'use client'
import InstructionsComponent from "@/components/instructionsComponent";
import styles from "./page.module.css";
import "./globals.css";
import { ChakraProvider } from '@chakra-ui/react';

export default function Home() {
  return (
    <ChakraProvider>
    <main className={styles.main}>
      <InstructionsComponent></InstructionsComponent>
    </main>
    </ChakraProvider>
  );
}
