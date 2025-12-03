
import GetStart from "@/components/getStart";
import Navbar from "@/components/nav-bar";
import Image from "next/image";

export default function Home() {
  return (
    <>
  <Navbar />
  <main className="w-screen h-full relative flex items-center">
    <div>
      <img src="/mainBack.jpg" alt="banner" className="h-screen w-screen object-cover" />
    </div>

    <div className="absolute flex flex-col items-start p-52 w-1/2 text-white space-y-6">
      <div>
        <h1 className="text-6xl font-bold">Ciel Mind</h1>
        <p className="mt-4 text-lg">
          Your space to plan, organize, and create a calmer, more focused day. Turn your ideas into action and make every moment count.
        </p>
      </div>
      <GetStart />
    </div>
  </main>
</>

  );
}
