import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function MainLayout({ children }) {
  return (
    <body className="bg-[#f5f5f5] dark:bg-[#0f172a] text-black dark:text-[#f5f5f5]">

      <Navbar />
      {children}
      <Footer />

    </body>
  );
}