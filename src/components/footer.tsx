import { Autour_One } from "next/font/google"
import Image from "next/image"
import { Sludlink_logo } from "./studlink_logo"
import { Line } from "./line"
import Link from "next/link"


export const Footer = () => {
    return(
        <>
        <Line />
        <div className="bg-black text-white flex justify-around py-5">
          <Sludlink_logo />
            <div className="flex flex-col">
                <h2 className="font-bold text-xl">About</h2>
                <Link href="#">О проекте</Link>
                <Link href="#">О нас</Link>
                <Link href="#">Пользовательское соглашение</Link>
            </div>
            <div className="flex flex-col">
                <h2 className="font-bold text-xl">Contact</h2>
                <Link href="#">studlink-support@gamil.com</Link>
                <div className="flex">
                    <Image src="/tg-logo.svg" alt="" width={24} height={24} />
                    <Link className="pl-2" href="#">Telegram</Link>
                </div>
                <div className="flex">
                    <Image src="/vk-logo.svg" alt="" width={24} height={24}/>
                    <Link className="pl-2" href="#">Вконтакте</Link>
                </div>
            </div>
            <div className="flex flex-col">
                <h2 className="font-bold text-xl">Help</h2>
                <div className="flex">
                    <Image src="/vopros.svg" alt="" width={24} height={24}/>
                    <Link className="pl-2" href="">Вопрос - Ответ</Link>
                </div>
                <div className="flex">
                    <Image src="/4el.svg" alt="" width={24} height={24}/>
                    <Link className="pl-2" href="">Служба Поддержки</Link>
                </div>
            </div>
        </div>
      </>
    )
}