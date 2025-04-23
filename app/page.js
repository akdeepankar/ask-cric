import Navbar from "./components/Navbar";
import Welcome from "./components/Welcome";
import Chat from "./components/Chat";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)]">
       <Navbar />

      <div className="flex flex-1">
        <Welcome/>
        <Chat />
      </div>
    </div>
  );
}
