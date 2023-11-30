import BackOfficeLayout from "@/components/layout/BackOfficeLayout";
import "@/styles/globals.css";
import { ThemeProvider } from "@emotion/react";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useRouter } from "next/router";

import theme from "@/styles/theme";
import { persistor, store } from "../redux/store";
import refreshAccessToken from "./api/refreshAccessToken";
import verifyRole from "./api/verifyRole";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page);
  const router = useRouter();

  // useEffect(() => {
  //   refreshAccessToken();
  //   if (router.pathname !== "/" && !router.pathname.includes("auth")) {
  //     if (verifyRole()) {
  //       console.log("Admin state.");
  //     } else {
  //       console.log("NOT Admin state.");
  //       router.push("/");
  //     }
  //   }
  // }, [Component, pageProps, router]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          {getLayout(<Component {...pageProps} />)}
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
