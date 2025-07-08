import { Autour_One } from "next/font/google"
import Image from "next/image"
import { Sludlink_logo } from "./studlink_logo"
import { Line } from "./line"


export const Footer = () => {
    return(
        <>
        <Line />
        <div className="bg-black text-white flex justify-around py-5">
          <Sludlink_logo />
            <div className="flex flex-col">
                <h2 className="font-bold text-xl">About</h2>
                <a href="#">О проекте</a>
                <a href="#">О нас</a>
                <a href="#">Пользовательское соглашение</a>
            </div>
            <div className="flex flex-col">
                <h2 className="font-bold text-xl">Contact</h2>
                <a href="#">yfgsyfga@gamil.com</a>
                <div className="flex">
                    <Image src="/tg-logo.svg" alt="" width={24} height={24} />
                    <a className="pl-2" href="#">Telegram</a>
                </div>
                <div className="flex">
                    <Image src="/vk-logo.svg" alt="" width={24} height={24}/>
                    <a className="pl-2" href="#">Вконтакте</a>
                </div>
            </div>
            <div className="flex flex-col">
                <h2 className="font-bold text-xl">Help</h2>
                <div className="flex">
                    <Image src="/vopros.svg" alt="" width={24} height={24}/>
                    <a className="pl-2" href="">Вопрос - Ответ</a>
                </div>
                <div className="flex">
                    <Image src="/4el.svg" alt="" width={24} height={24}/>
                    <a className="pl-2" href="">Служба Поддержки</a>
                </div>
            </div>
        </div>
      </>
    )
}