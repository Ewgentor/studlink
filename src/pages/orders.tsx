import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PopUp from "../components/pop_up";
import React from "react";
import { api } from "~/utils/api";

export default function Orders() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState<String[]>()
    const projects = session?.user.role === "company" ? api.post.getByCompanyId.useQuery(session?.user.id ?? "") : api.post.getAll.useQuery();
    const bidsCountQueries = api.useQueries((t) => {
        return projects.data?.map((project) => (t.bid.countByProjectId(project.id))) ?? []
    });
    useEffect(() => {
        if (status === "unauthenticated") {
          void router.push("/");
        }
      }, [status, router]);

    
  return (
    <>
        <Head>
            <title>StudLink - Список заданий</title>
            <meta name="description" content="" />
        </Head>
        <div className="flex min-h-screen justify-evenly items-center bg-[url(/rocket.png)] bg-cover bg-center text-white ">
            <div className="flex flex-col">
                <div className="pb-4">
                    <input className="bg-white text-black rounded-lg p-2 border-1 border-solid shadow-lg shadow-cyan-500/50 w-xl" type="text" placeholder="Поиск по ключевым словам"/>
                    <button className="text-lg font-bold bg-teal-900 py-2 px-10 rounded-xl ml-5 cursor-pointer" onClick={()=>{}}>Найти</button>
                </div>
                <p className="pb-6">Найдено {projects.data?.length} заданий</p>

                {projects.data?.map((project, index) => {
                    const bidsCount = bidsCountQueries[index]?.data ?? 0;
                return <div key={project.id} className="mb-8 border border-gray-300 rounded-lg bg-gradient-to-r from-black/80 to-black/30">
                    <div className="m-5 flex justify-between">
                        <div className="flex">
                            <Image src="/monitor.svg" alt="" width={45} height={45}  className=""/>
                            <div className="flex flex-col pl-3">
                                <p className="font-bold pb-3">{project.title}</p>
                                <p className="pb-3">Категория: {project.category}</p>
                                <p className="pb-3">Дедлайн: {project.deadline.getHours()}:{String(project.deadline.getMinutes()).padStart(2, '0')}</p>
                                <p className="">Отклики: {bidsCount}</p>
                            </div>
                        </div>
                        <div className="flex pl-8">
                            <div className="flex flex-col justify-between ">
                                <div className="flex justify-center">
                                    <p className="pb-3">Бюджет до {project.budget} ₽</p>
                                </div>
                                <p className="w-sm text-wrap">{project.description}</p>
                                <div className="flex justify-end">
                                    <button className="text-lg font-bold bg-teal-900 py-1 px-10 rounded-xl">Откликнуться</button>
                                </div>
                            </div>
                            <div>
                                <Link href={"#"}>
                                    <Image src="/edit-order.svg" alt="" width={25} height={25} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                })}
                
            </div>

            <div className="w-[340px] bg-black/40 rounded-xl p-6 flex flex-col gap-2 text-white border border-gray-300">
                <div className="flex items-center gap-2 mb-2">
                    <input 
                      id="all-categories" 
                      type="checkbox" 
                      className="w-5 h-5 text-blue-600 accent-cyan-700 rounded-sm"
                      onChange={(e) => {
                        const checkboxes = document.querySelectorAll<HTMLInputElement>('.subcategory-checkbox');
                        checkboxes.forEach((checkbox) => {
                          checkbox.checked = e.target.checked;
                        });
                      }}
                    />
                    <label htmlFor="all-categories" className="ms-2 text-sm font-medium text-white cursor-pointer">Все категории</label>
                </div>
                <Category label="Разработка сайта" subcategories={["1C", "Backend", "Frontend", "ML"]} />
                <Category label="Компьютерная помощь" subcategories={["Ремонт", "Настройка", "Установка ПО", "Консультация"]} />
                <Category label="Безопасность" subcategories={["Антивирусы", "Защита данных", "VPN", "Кибербезопасность"]} />
                <Category label="Дизайн" subcategories={["Графический", "Интерьеры", "UI/UX", "3D-моделирование"]} />
            </div>
        </div>
    </>
  );
}


function Category({ label, subcategories }: { label: string, subcategories?: string[] }) {
  return (
    <div className="mb-2">
        <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            <span>{label}</span>
        </div>
      {subcategories && (
        <div className="ml-8 mt-1 flex flex-col gap-1">
          {subcategories.map(sub => (
            <div key={sub} className="flex items-center gap-2">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-blue-600 accent-cyan-700 rounded-sm subcategory-checkbox"
              />
              <span>{sub}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}