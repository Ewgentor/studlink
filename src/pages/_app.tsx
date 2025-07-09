import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Geist } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Footer } from "../components/footer";
import { Header } from "../components/header";

const geist = Geist({
  subsets: ["latin"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div className={geist.className}>
        <Header/>
        <Component {...pageProps} />
        <Footer/>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
