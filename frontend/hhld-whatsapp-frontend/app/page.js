import Image from "next/image";
import Auth from "./auth";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-between p-24">
      <Auth/>
    </main>
  );
}
