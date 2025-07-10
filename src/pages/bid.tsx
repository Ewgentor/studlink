import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

export default function MyBids() {
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

const handleDeleteBid = (bidId: string) => {
    if (confirm("Вы уверены?")) {
        deleteBid.mutate(bidId)
    }
}

  const formatDeadline = (date: Date) => {
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  if (status === "unauthenticated") {
    void router.push("/");
    return null;
  }

  return (
    <>
      <Head>
        <title>StudLink - Мои отклики</title>
        <meta name="description" content="Мои отклики на проекты" />
      </Head>
      <div className="min-h-screen bg-[url(/robot.png)] bg-cover bg-center text-white p-8">
        <h1 className="text-3xl font-bold mb-8">Мои отклики</h1>
        
        {!bids || bids.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl mb-4">У вас пока нет откликов</p>
            <Link 
              href="/orders" 
              className="text-lg font-bold bg-teal-900 py-2 px-6 rounded-xl hover:bg-teal-800 transition-colors inline-block"
            >
              Найти проекты
            </Link>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            
            { bids.map((bid) => (
                <div 
                key={bid.id} 
                className="border border-gray-300 rounded-lg bg-gradient-to-r from-black/80 to-black/30 hover:shadow-lg hover:shadow-cyan-500/50 transition-shadow"
                >
                    <div className="m-5 flex justify-between">
                        <div className="flex">
                            <div className="flex flex-col pl-3">
                                <p className="font-bold pb-3 text-xl">
                                    {bid.project.title}
                                    <span className={`ml-3 text-sm font-normal ${
                                      bid.status === 'accepted' ? 'text-green-400' :
                                      bid.status === 'rejected' ? 'text-red-400' :
                                      'text-yellow-400'
                                    }`}>
                                      ({bid.status === 'accepted' ? 'Принят' : bid.status === 'rejected' ? 'Отклонен' : 'На рассмотрении'})
                                    </span>
                                </p>
                                <p className="pb-3">Компания: {bid.project.company?.name ?? "Не указана"}</p>
                                <p className="pb-3">Категория: {bid.project.category}</p>
                                <p className="pb-3">Дедлайн: {formatDeadline(bid.project.deadline)}</p>
                            </div>
                        </div>
                        <div className="flex pl-8">
                            <div className="flex flex-col justify-between">
                                <div className="flex justify-center">
                                    <p className="pb-3">Бюджет до {bid.project.budget} ₽</p>
                                </div>
                                <p className="w-sm text-wrap max-w-[300px]">{bid.project.description}</p>
                                <div className="flex justify-end gap-4 mt-4">
                                    {bid.status !== "accepted" &&
                                    <button 
                                      onClick={() => handleDeleteBid(bid.id)}
                                      className="text-lg font-bold bg-red-900 py-1 px-6 rounded-xl hover:bg-red-800 transition-colors"
                                    >
                                      {deleteBid.isPending ? "Загрузка...": "Отозвать"}
                                    </button>}
                                    {bid.status === 'accepted' && (
                                      <Link 
                                        href={`/project/${bid.project.id}`}
                                        className="text-lg font-bold bg-teal-900 py-1 px-6 rounded-xl hover:bg-teal-800 transition-colors"
                                      >
                                        Подробнее
                                      </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        )}
        </div>
    </>
  );
}