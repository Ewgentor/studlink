import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useState } from "react";

export default function MyProject() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const id = typeof router.query.id === "string" ? router.query.id : "";
    const { data: projectBids, isLoading } = api.bid.getByProjectId.useQuery(
        id,
        { enabled: !!id}
    );
    const {data: userBid} = api.bid.getBidByPrStIds.useQuery(
      id,
      { enabled: !!id }
    ) 
    const utils = api.useUtils();

    const { data: dataTitle } = api.post.getProjectName.useQuery(
        id,
        {
            enabled: !!id
        }
    ) 

    const changeBid = api.bid.changeBid.useMutation({
        onSuccess: () => {
            void utils.bid.invalidate
            void router.reload();
        }
    })
    
    const handleChange = (bidId: string, message: string, status: "accepted"|"rejected") => {
        changeBid.mutate({
            bidId, message, status
        })
    }

    const [message, setMessage] = useState("");

    const deleteBid = api.bid.deleteBid.useMutation({
      onSuccess: () => {
          void utils.bid.invalidate();
      },
    })

    if (status === "unauthenticated") {
      void router.push("/");
    }
    
    if (!projectBids) return <div className="min-h-screen bg-[url(/robot.png)] bg-cover bg-center text-white p-8">Загрузка откликов...</div>;
    return session?.user.role === "company" ? (
      <>
        <Head>
          <title>StudLink - Задание {dataTitle?.title ?? "Загрузка..."} </title>
          <meta name="description" content="Конкретное задание" />
        </Head>
        
          <div className="min-h-screen bg-[url(/robot.png)] bg-cover bg-center text-white p-8">
            <div className="pl-20">
              <p className="font-bold text-xl py-12">Студенты откликнувшиеся на ваше задание</p>
              <table className="w-full text-left border-separate border-spacing-y-2 pb-8">
                <thead className="text-white text-sm">
                  <tr className="text-center">
                    <th className="pb-2">Имя</th>
                    <th className="pb-2">Роль</th>
                    <th className="pb-2">Рейтинг</th>
                    <th className="pb-2">Email</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                {projectBids.map((bid) => (
                    bid.status !== "rejected" &&
                  <tr key={bid.id} className="bg-black/60 rounded-lg text-center">
                    <td className="py-2 font-medium">{bid.student.name}</td>
                    <td className="py-2"> 
                      {bid.student.skills.map((skill) => (
                        <p key={skill}>{skill + " "}</p>
                      ))}
                    </td>
                    <td className="py-2 flex justify-center">
                      <p className="pr-4">{bid.student.rating}</p>
                      <Image src="/like.svg" alt="" width={20} height={20}/>
                    </td>
                    <td className="py-2">{bid.student.email}</td>
                    <td className="py-2">
                    </td>
                    <td className="py-2 flex  justify-around">
                      <button className="bg-emerald-900 hover:bg-emerald-800 text-white px-5 py-1 rounded-lg text-sm font-semibold transition" onClick={e =>  {
                        e.preventDefault();
                        handleChange(bid.id, message, "accepted");
                      }}>
                        Связаться
                      </button>
                      <button className="bg-red-900 hover:bg-red-400 text-white px-5 py-1 rounded-lg text-sm font-semibold transition" onClick={e =>  {
                        e.preventDefault();
                        handleChange(bid.id, message, "rejected");
                      }}>
                        Отклонить
                      </button>
                    </td>
                  </tr>

                ))}
                </tbody>
            </table>
            <div className="flex flex-col justify-center items-center w-[400px] p-8">
              <div className="w-full bg-[#232323] rounded-xl p-6">
                <label className="block text-lg font-bold mb-4" htmlFor="message">Введите сообщение для студента:</label>
                <textarea
                  onChange={e => {setMessage(e.target.value)}}
                  id="message"
                  className="w-full h-32 bg-[#153235] text-gray-300 rounded-lg p-4 resize-none placeholder:text-gray-400 outline-none border-none"
                  placeholder="Ваше сообщение"
                />
              </div>
            </div>
          </div>
        </div>
      </>
    ) : (
        <>
        <Head>
          <title>StudLink - Задание {dataTitle?.title ?? "Загрузка..."} </title>
          <meta name="description" content="Конкретное задание" />
        </Head>
        <div className="min-h-screen bg-[url(/robot.png)] bg-cover bg-center text-white p-8">
          <div className="flex flex-col justify-center items-center w-[400px] p-8">
            <div className="w-full bg-[#232323] rounded-xl p-6">
              <p className="font-bold test-xl pb-4">Задание {dataTitle?.title ?? "Загрузка..."} Принято!</p>
              <label className="block text-lg font-bold mb-4" htmlFor="message">Сообщение от заказчика:</label>
              <p 
              id="message"
              className="w-full h-32 bg-[#153235] text-gray-300 rounded-lg p-4 resize-none placeholder:text-gray-400 outline-none border-none ">
                {userBid?.message}
              </p>
            </div>
          </div>
        </div>
        </>
    );
}