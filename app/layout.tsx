import './globals.css'
import type { Metadata } from 'next'
import { headers } from 'next/headers'

import { cookieToInitialState } from 'wagmi'

import { config } from '@/config'
import { ContextProvider } from '@/context'
import Footer from '@/components/instructionsComponent/navigation/footer'
import Navbar from '@/components/instructionsComponent/navigation/navbar'
import { ChakraProvider } from '@chakra-ui/react'

export const metadata: Metadata = {
  title: 'Oops!',
  description: 'Not to worry - eject your tokens into a new wallet!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialState = cookieToInitialState(config, headers().get('cookie'))
  return (
    <html lang="en">
      <body>
        <ContextProvider initialState={initialState}>
          <ChakraProvider>
            <div style={{ display: "flex", flexDirection: "column", minHeight: "105vh" }}>
              <Navbar />
              <div style={{ flexGrow: 1 }}>{children}</div>
              <Footer />
            </div>
          </ChakraProvider>
        </ContextProvider>
      </body>
    </html>
  );
}
