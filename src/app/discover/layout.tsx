export default function DiscoverLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <nav className="m-10">[Navbar goes in layout.]</nav>
      <main className="m-10">{children}</main>
    </>
  );
}
