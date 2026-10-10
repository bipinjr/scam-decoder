import { Checker } from "@/components/Checker";
import { Footer, HowItWorks, Nav, Principles, Research } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Checker>
          <Principles />
          <HowItWorks />
        </Checker>
        <Research />
      </main>
      <Footer />
    </>
  );
}
