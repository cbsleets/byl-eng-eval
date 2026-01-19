import DiscoverNav from "./DiscoverNav";
import { AIProvider } from "./AIContext";

export default function DiscoverLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AIProvider>
      <div className="min-h-screen bg-[#f8f5f0]">
        <DiscoverNav />
        <main>{children}</main>
      </div>
    </AIProvider>
  );
}
