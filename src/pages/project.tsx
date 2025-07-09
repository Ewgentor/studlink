import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

export default function MyPoject() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { data: bids, isLoading } = api.bid.getByStudentId.useQuery(
      session?.user.id ?? "",
      { enabled: !!session?.user.id }
    );

    const utils = api.useUtils();


    const deleteBid = api.bid.deleteBid.useMutation({
      onSuccess: () => {
          void utils.bid.invalidate();
      },
    })

    if (status === "unauthenticated") {
      void router.push("/");
      return null;
    }

    return (
        <>
            <Head>
              <title>StudLink - Задание </title>
              <meta name="description" content="Конкретное задание" />
            </Head>
            <div className="min-h-screen bg-[url(/robot.png)] bg-cover bg-center text-white p-8">


            </div>
        </>
    );
}