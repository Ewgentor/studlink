import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";



export default function PopUp({open, setOpen}: { open: boolean, setOpen: (v: boolean) => void }) {
    const { data: session, status } = useSession();

    useEffect(() => {
        const handler = () => setOpen(true);
        window.addEventListener('openProfileModal', handler);
        return () => window.removeEventListener('openProfileModal', handler);
        
      }, [status]);


    return (
    <div className=" flex flex-col justify-between bg-black">
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="relative py-8 pr-8 rounded-[36px] overflow-hidden shadow-2xl flex items-center justify-center bg-[url(/all.jpg)] bg-cover bg-center border-1 border-sky-500">
              <div className="flex items-center left-6 top-6 gap-4 w-[calc(100%-48px)] justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={() => setOpen(false)} className="bg-black bg-opacity-40 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-70 transition">
                    <Image src="/back.svg" alt="Назад" width={30} height={30} />
                  </button>
                </div>
              </div>
              {/* Центральный блок */}
              <div className="w-full h-full flex flex-col items-center justify-center">
                <form
                  className="w-[900px] flex flex-row gap-12 items-start relative"
                  onSubmit={e => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const name = (form.elements.namedItem('name') as HTMLInputElement)?.value;
                    const place = (form.elements.namedItem('place') as HTMLInputElement)?.value;
                    const about = (form.elements.namedItem('about') as HTMLTextAreaElement)?.value;
                    alert(`Имя: ${name}\nМесто учебы: ${place}\nО себе: ${about}`);
                  }}
                >
                  {/* Левая часть */}
                  <div className="flex flex-col gap-6 flex-1 relative">
                    {/* Блок с аватаркой, ником, почтой, лайком */}
                    <div className="flex items-center gap-4 mb-4">
                      <img src={session?.user?.image ?? "/avatar.png"} alt="avatar" className="w-16 h-16 rounded-full border-4 border-white shadow-lg" />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-xl font-bold">{session?.user?.name}</span>
                          <Image src="/Like.svg" alt="like" width={15} height={15}/>
                          <span className="text-white text-lg font-bold">12</span>
                        </div>
                        <span className="text-white text-sm opacity-80">{session?.user?.email}</span>
                      </div>
                    </div>
                    <label className="text-white text-base font-semibold">ФИО
                      <input name="name" type="text" placeholder="(не обязательно)" className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-700 text-black bg-white" />
                    </label>
                    <label className="text-white text-base font-semibold">Ваши навыки
                      <div className="mt-2"><SkillSelect /></div>
                    </label>
                    <button type="submit" className="mt-8 bg-cyan-700 hover:bg-cyan-700 text-white font-bold py-3 px-12 rounded-xl text-xl w-full max-w-xs self-start cursor-pointer">Сохранить</button>
                  </div>
                  <div className="flex-1 flex flex-col gap-6 mt-12">
                    <label className="text-white text-base font-semibold">Расскажите о себе
                      <textarea name="about" placeholder="О себе..." rows={10} className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-700 text-black bg-white resize-none" />
                    </label>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
    </div>)
}

// Кастомный мультиселект навыков
function SkillSelect() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const skills = ["Frontend", "Backend", "Аналитик"];
  return (
    <div className="relative min-h-50 min-w-80 overflow-hidden">
      <div
        className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white text-black cursor-pointer flex justify-between items-center min-h-13"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="truncate">{selected.length ? selected.join(", ") : "Выберите навыки"}</span>
        <svg className={`w-4 h-4 ml-2 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </div>
      {open && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-10">
          {skills.map((skill) => (
            <div
              key={skill}
              className="px-4 py-2 hover:bg-cyan-100 cursor-pointer flex items-center text-black rounded-lg"
              onClick={() => {
                setSelected((prev) =>
                  prev.includes(skill)
                    ? prev.filter((s) => s !== skill)
                    : [...prev, skill]
                );
              }}
            >
              <span>{skill}</span>
              {selected.includes(skill) && (
                <Image src="/select-black.svg" alt="" width={15} height={15} className="ml-2" />
              )}
            </div>
          ))}
        </div>
      )}
      {/* Выбранные навыки ниже */}
      <div className="flex flex-wrap gap-2 mt-3 overflow-auto max-h-40">
        {selected.map((skill) => (
          <div key={skill} className="flex items-center bg-cyan-700 text-white rounded-lg px-3 py-1 text-sm cursor-pointer" onClick={() => setSelected(prev => prev.filter(s => s !== skill))}>
            {skill}
            <Image src="/select-white.svg" alt="" width={15} height={15} className="ml-1" />
          </div>
        ))}
      </div>
    </div>
  );
}