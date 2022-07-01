import Head from "next/head";
import styles from "styles/home.module.scss";
import { trpc } from "utils/trpc";

export default function Index() {
  const healthQuery = trpc.useQuery(["health"]);

  console.log({ healthQuery });

  return (
    <>
      <Head>
        <title>Hello world!</title>
      </Head>

      <h1 className={styles.title}>Hello world!</h1>
    </>
  );
}
