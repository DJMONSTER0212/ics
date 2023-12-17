import React from "react";
import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import config from "@/tailwind.config.js";
import SettingProvider from "@/conf/context/SettingsContext";
import "@/styles/globals.css";

// Layouts
import PanelLayout from "@/layouts/panel/Layout";
import WebsiteLayout from "@/layouts/website/Layout";
import DefaultLayout from "@/layouts/Default";

const primaryColor = config.theme.extend.colors.primary["500"]; // Primary color of the website

const PanelLayoutComponent = ({ children }) => (
  <SettingProvider>
    <PanelLayout>{children}</PanelLayout>
  </SettingProvider>
);


const App = ({ Component, pageProps }) => {
  let Layout;
  switch (Component.layout) {
    case "panelLayout":
      Layout = PanelLayoutComponent;
      break;
    case "websiteLayout":
      Layout = WebsiteLayout;
      break;
    default:
      Layout = DefaultLayout;
      break;
  }

  return (
    <>
      {/* For progress bar */}
      <NextTopLoader />
      {/* For Next Auth */}
      <SessionProvider session={pageProps.session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </>
  );
};

export default App;
