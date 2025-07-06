import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export const Header = () => {
  const { data: session } = useSession();

  return (
    <div className="flex justify-between px-8 py-4 border-b bg-black"> 
      <div className="place-items-center">
        <div className="font-bold text-white">StudLink</div>
        <div className="bg-teal-900 text-white px-2">FREELANCER</div>
      </div>
      <div className="flex place-items-center">
        { session?.user ? (
          <div className="flex flex-row gap-10">
            <a href="#" className="cursor-pointer text-white" >{ session.user.name }</a>
            <button className="cursor-pointer text-white" onClick={() => void signOut()}>Sign Out</button>
          </div>
        ) : (
          <button className="cursor-pointer text-white" onClick={() => void signIn()}>Sign In</button>
        )}
      </div>
    </div>
  )
}