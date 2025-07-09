import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PopUp from "../components/pop_up";

export default function Welcome() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
          void router.push("/");
        }
      }, [status, router]);

    
  return (
    <>
      <Head>
        <title>StudLink</title>
        <meta name="description" content="" />
      </Head>
      <div className="min-h-screen flex flex-col justify-between bg-black">
        <main className="flex-1 flex flex-row items-center justify-between px-16 py-8">
            <div className="flex flex-col gap-8 max-w-lg">
                <div className="bg-black bg-opacity-80 p-8 rounded-xl shadow-lg">
                    <h2 className="text-white text-2xl font-bold mb-4">Добро пожаловать!<br/>Можете оформить портфолио</h2>
                    <button onClick={() => setOpen(true)} className="bg-cyan-800 hover:bg-cyan-700 text-white font-bold py-2 px-8 rounded w-full mb-4">Начать</button>
                </div>
                <div className="bg-black bg-opacity-80 p-8 rounded-xl shadow-lg">
                    <h3 className="text-white text-xl font-bold mb-4">Либо перейти к заказам</h3>
                    <Link href="/jobs">
                        <button className="bg-cyan-800 hover:bg-cyan-700 text-white font-bold py-2 px-8 rounded w-full">Перейти</button>
                    </Link>
                </div>
            </div>
            <div className="hidden md:block ml-12">
                <Image src="/wellcome.png" alt="Welcome" width={1230} height={700} className="rounded-xl shadow-2xl" />
            </div>

        </main>
      </div>
      <PopUp open={open} setOpen={setOpen}/>
    </>
  );
}