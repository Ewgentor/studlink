import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Sludlink_logo } from "./studlink_logo";
import { Line } from "./line";

export const Header = () => {
  const { data: session } = useSession();

  return (
    <>
    <div className="flex justify-between px-8 py-4 border-b bg-black"> 
      <div className="flex justify-end">
        <Sludlink_logo />
        <a href="" className="text-white">Создать</a>
      </div>
      <div className="flex place-items-center">
        { session?.user ? (
          <div className="flex flex-row gap-10">
            <a href="#" className="cursor-pointer text-white" >{ session.user.name }</a>
            <button className="cursor-pointer text-white" onClick={() => void signOut()}>Выйти</button>
          </div>
        ) : (
          <button className="cursor-pointer text-white" onClick={() => void signIn()}>Войти в аккаунт</button>
        )}
      </div>
    </div>
    <Line />
    </>
  )
}