import Image from "next/image";
import Sidebar from "./components/sidebar";
import Dashboard from "./components/dashboard";
import Side from "./components/side";

export default function Home() {
  return (
    <>
    <Sidebar/>
    <Side/>
    <section className="">
      <Dashboard/>
    </section>
    </>
  );
}
