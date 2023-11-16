import BackOfficeLayout from "@/components/layout/BackOfficeLayout";
import "@/styles/globals.css";
import { ThemeProvider } from "@emotion/react";
import type { AppProps } from "next/app";

import theme from "@/styles/theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <BackOfficeLayout>
        <Component {...pageProps} />
      </BackOfficeLayout>
    </ThemeProvider>
  );
}
