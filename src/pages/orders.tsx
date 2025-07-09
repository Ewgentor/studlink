import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { api } from "~/utils/api";

const ALL_CATEGORIES = [
  "1C", "Backend", "Frontend", "ML", 
  "Ремонт", "Настройка", "Установка ПО", "Консультация",
  "Антивирусы", "Защита данных", "VPN", "Кибербезопасность",
  "Графический", "Интерьеры", "UI/UX", "3D-моделирование"
];

export default function Orders() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const projects = session?.user.role === "company" 
    ? api.post.getByCompanyId.useQuery(session?.user.id ?? "") 
    : api.post.getAll.useQuery();
  
  const bidsCountQueries = api.useQueries((t) => {
    return projects.data?.map((project) => 
      t.bid.countByProjectId(project.id)
    ) ?? [];
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      void router.push("/");
    }
  }, [status, router]);

  const filteredProjects = projects.data?.filter(project => {
    const matchesSearch = 
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategories.length === 0 || 
      selectedCategories.includes(project.category);
    
    return matchesSearch && matchesCategory;
  }) ?? [];

  const handleCategoryChange = (category: string, isChecked: boolean) => {
    setSelectedCategories(prev => 
      isChecked 
        ? [...prev, category] 
        : prev.filter(c => c !== category)
    );
  };

  const handleSelectAllCategories = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checkboxes = document.querySelectorAll<HTMLInputElement>('.subcategory-checkbox');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = e.target.checked;
    });
    setSelectedCategories(e.target.checked ? ALL_CATEGORIES : []);
  };

  const formatDeadline = (date: Date) => {
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} ${String(date.getDay()).padStart(2, '0')}.${String(date.getMonth()).padStart(2, '0')}.${date.getFullYear()}`;
  };

  return (
    <>
      <Head>
        <title>StudLink - Список заданий</title>
        <meta name="description" content="Платформа для поиска фриланс-заданий" />
      </Head>
      <div className="flex min-h-screen justify-evenly items-center bg-[url(/rocket.png)] bg-cover bg-center text-white">
        <div className="flex flex-col w-[800px]">
          <div className="pb-4 flex items-center">
            <input
              className="bg-white text-black rounded-lg p-2 border border-gray-300 shadow-lg shadow-cyan-500/50 flex-grow"
              type="text"
              placeholder="Поиск по названию или описанию"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <p className="pb-6 text-lg">Найдено {filteredProjects.length} заданий</p>

          <div className="space-y-6">
            {filteredProjects.map((project, index) => {
              const bidsCount = bidsCountQueries[index]?.data ?? 0;
              return (
                <div key={project.id} className="border border-gray-300 rounded-lg bg-gradient-to-r from-black/80 to-black/30 hover:shadow-lg hover:shadow-cyan-500/50 transition-shadow">
                  <div className="m-5 flex justify-between">
                    <div className="flex">
                      <Image src="/monitor.svg" alt="Иконка проекта" width={45} height={45} />
                      <div className="flex flex-col pl-3">
                        <p className="font-bold pb-3 text-xl">{project.title}</p>
                        <p className="pb-3">Категория: {project.category}</p>
                        <p className="pb-3">Дедлайн: {formatDeadline(project.deadline)}</p>
                        <p>Отклики: {bidsCount}</p>
                      </div>
                    </div>
                    <div className="flex pl-8">
                      <div className="flex flex-col justify-between">
                        <div className="flex justify-center">
                          <p className="pb-3">Бюджет до {project.budget} ₽</p>
                        </div>
                        <p className="w-sm text-wrap max-w-[300px]">{project.description}</p>
                        <div className="flex justify-end">
                          <button className="text-lg font-bold bg-teal-900 py-1 px-10 rounded-xl hover:bg-teal-800 transition-colors">
                            Откликнуться
                          </button>
                        </div>
                      </div>
                      {session?.user.role === "company" && (
                        <div className="ml-4">
                          <Link href={`/edit-project/${project.id}`}>
                            <Image 
                              src="/edit-order.svg" 
                              alt="Редактировать" 
                              width={25} 
                              height={25} 
                              className="hover:opacity-80 transition-opacity"
                            />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-[340px] bg-black/40 rounded-xl p-6 flex flex-col gap-2 text-white border border-gray-300">
          <div className="flex items-center gap-2 mb-2">
            <input
              id="all-categories"
              type="checkbox"
              className="w-5 h-5 text-blue-600 accent-cyan-700 rounded-sm"
              onChange={handleSelectAllCategories}
              checked={selectedCategories.length === ALL_CATEGORIES.length}
            />
            <label htmlFor="all-categories" className="ms-2 text-sm font-medium text-white cursor-pointer">
              Все категории
            </label>
          </div>
          <Category
            label="Разработка сайта"
            subcategories={["1C", "Backend", "Frontend", "ML"]}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
          />
          <Category
            label="Компьютерная помощь"
            subcategories={["Ремонт", "Настройка", "Установка ПО", "Консультация"]}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
          />
          <Category
            label="Безопасность"
            subcategories={["Антивирусы", "Защита данных", "VPN", "Кибербезопасность"]}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
          />
          <Category
            label="Дизайн"
            subcategories={["Графический", "Интерьеры", "UI/UX", "3D-моделирование"]}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      </div>
    </>
  );
}

function Category({
  label,
  subcategories,
  selectedCategories,
  onCategoryChange
}: {
  label: string;
  subcategories?: string[];
  selectedCategories: string[];
  onCategoryChange: (category: string, isChecked: boolean) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-2">
      <div 
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
        <span className="font-medium">{label}</span>
      </div>
      {isExpanded && subcategories && (
        <div className="ml-8 mt-1 flex flex-col gap-1">
          {subcategories.map((sub) => (
            <div key={sub} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 accent-cyan-700 rounded-sm subcategory-checkbox"
                checked={selectedCategories.includes(sub)}
                onChange={(e) => onCategoryChange(sub, e.target.checked)}
              />
              <span className="text-sm">{sub}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}