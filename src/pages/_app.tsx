import * as React from "react";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { withTRPC } from "@trpc/next";
import { trpc } from "utils/trpc";
import type { AppProps } from "next/app";
import type { AppType } from "next/dist/shared/lib/utils";
import superjson from "superjson";
import { Layout } from "components/Layout";
import type { AppRouter } from "server/routers/_app";
import { SessionProvider } from "next-auth/react";

import "styles/globals.css";

const MyApp = (({ Component, pageProps }: AppProps) => {
  const sessionQuery = trpc.useQuery(["user.getSession"], { ssr: false });

  return (
    <SessionProvider session={sessionQuery.data?.session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}) as AppType;

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default withTRPC<AppRouter>({
  config() {
    return {
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      transformer: superjson,
      queryClientConfig: {
        defaultOptions: {
          queries: {
            retryOnMount: false,
            refetchOnWindowFocus: false,
            retry: false,
            staleTime: 60,
          },
        },
      },
    };
  },
  ssr: true,
})(MyApp);
