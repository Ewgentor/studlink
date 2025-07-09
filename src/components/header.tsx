import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Sludlink_logo } from "./studlink_logo";
import { Line } from "./line";
import PopUp from "./pop_up";
import { useState } from "react";
import Image from "next/image";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <>
    <div className="flex justify-between px-8 py-4 border-b bg-black"> 
      <div className="flex items-center">
        <Link href="/welcome">
          <Sludlink_logo />
        </Link>
        <div className="flex justify-content-around">
          {
            session?.user.role === "company" && <Link href="/jobs" className=" text-white ml-20 mr-15 font-bold"> Создать <br /> задание </Link>
          }
          {
            session?.user.role === "company" && <Link href="/orders" className=" text-white mr-15 font-bold"> Список <br /> заданий </Link>
          }
        </div>
      </div>
      
      <div className="flex place-items-center">
        { session?.user ? (
          <div className="flex flex-row gap-10">
            <div className="flex items-center gap-3">
              <img src={session.user.image ?? "/avatar.png"} alt="avatar" className="w-10 h-10 rounded-full border-2 border-white" />
              <div className="flex flex-col items-start">
                <span className="text-white font-bold leading-tight">{session.user.name}</span>
                <span className="text-white text-xs opacity-80">{session.user.email}</span>
              </div>
              <button onClick={() => setOpen(true)} className="">
                <Image src="/SettingsEdit.svg" alt="" width={20} height={20} className="cursor-pointer fill-white"/>
              </button>
            </div>
            <button className="cursor-pointer text-white ml-8" onClick={() => void signOut()}>Выйти</button>
          </div>
        ) : (
          <button className="cursor-pointer text-white ml-8" onClick={() => void signIn()}>Войти в аккаунт</button>
        )}
      </div>
    </div>
    <Line />
    <PopUp open={open} setOpen={setOpen}/>
    </>
  )
}