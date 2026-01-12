import Image from "next/image";
import Link from "next/link";
import { getAllRoles } from "@/lib/data/roles";

export default function Home() {
  const rolesData = getAllRoles();
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f5f0] font-sans text-[#10131a]">
      <div className="absolute -left-16 top-16 h-56 w-56 rounded-full bg-[#fde68a]/70 blur-3xl" />
      <div className="absolute right-10 top-40 h-72 w-72 rounded-full bg-[#a5b4fc]/40 blur-3xl" />
      <div className="absolute -bottom-30 left-1/3 h-80 w-80 rounded-full bg-[#fecdd3]/60 blur-3xl" />

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 pb-24 pt-20 sm:px-10">
        <section className="flex flex-col gap-6 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6b7280]">
            Role identity ranking
          </p>
          <h1 className="text-balance text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Find the roles that feel most like{" "}
            <span className="italic font-serif font-medium">you.</span>
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[#525866]">
            A quick ranking reveals which identity lenses you lead with and
            which ones sit in the background.
          </p>
          <div>
            <Link
              href="/discover"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#10131a] px-6 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:translate-y-[-2px] hover:bg-black"
            >
              View sample summary
            </Link>
          </div>
        </section>

        <section className="rounded-[28px] border border-black/10 bg-white/80 p-6 shadow-[0_30px_60px_-45px_rgba(15,23,42,0.35)] backdrop-blur sm:p-8">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6b7280]">
              The ten roles
            </p>
          </div>

          <div className="mt-6 overflow-hidden">
            <div className="flex w-max gap-4 animate-role-loop">
              {[...rolesData, ...rolesData].map((role, index) => (
                <div
                  key={`${role.id}-${index}`}
                  className="flex w-37.5 flex-col items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm font-semibold text-[#10131a] shadow-sm"
                >
                  <Image
                    src={`/roles/${role.id}.svg`}
                    alt={`${role.name} symbol`}
                    width={36}
                    height={36}
                  />
                  <span>{role.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
