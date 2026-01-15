import DiscoverNav from "./DiscoverNav";

export default function DiscoverLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <DiscoverNav />
      <main>{children}</main>
    </div>
  );
}
