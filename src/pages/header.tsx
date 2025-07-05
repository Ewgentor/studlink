import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export const Header = () => {
  const { data: session } = useSession();

  return (
    <div className="flex justify-between px-2 py-4 border-b">
      <div>Я тебя найду и уничтожу, я просрал на поиск этого говна 3 часа</div>

      <div>
        { session?.user ? (
          <div className="flex flex-row gap-2">
            <p>{ session.user.name }</p>
            <button onClick={() => void signOut()}>Sign Out</button>
          </div>
        ) : (
          <button onClick={() => void signIn()}>Sign In</button>
        )}
      </div>
    </div>
  )
}