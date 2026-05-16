import DemoTemplateClient from "./demo-template-client";
import { sampleInvitation } from "../../data/sampleInvitation";

const demoLinks = [
  {
    label: "Public invitation",
    href: `/u/${sampleInvitation.slug}`,
    detail: "Cek halaman undangan tanpa nama tamu.",
  },
  {
    label: "Personal guest link",
    href: `/u/${sampleInvitation.slug}/to/${sampleInvitation.guests[0]?.slug || "bapak-andi"}`,
    detail: "Cek personalisasi nama tamu dan RSVP.",
  },
  {
    label: "Preview dashboard",
    href: `/preview?slug=${sampleInvitation.slug}`,
    detail: "Cek preview internal untuk admin.",
  },
  {
    label: "Admin dashboard",
    href: "/dashboard",
    detail: "Cek flow order, template, tamu, media, dan publish.",
  },
];

const flowSteps = [
  "User pesan via WhatsApp dan pembayaran manual.",
  "Admin buat order, pilih template, lalu isi data undangan.",
  "Admin upload media, set fitur, preview, lalu publish.",
  "User pakai guest generator dan broadcast manual ke WhatsApp.",
  "Tamu buka link personal dan mengisi RSVP.",
];

export const metadata = {
  title: "Demo Flow - NusaInvite",
  description: "Demo alur undangan digital dari order manual sampai RSVP.",
};

export default function DemoPage() {
  const firstGuest = sampleInvitation.guests[0]?.name || "Tamu Demo";

  return (
    <main className="min-h-screen bg-[#f5efe4] text-[#24160f]">
      <section className="mx-auto max-w-6xl px-5 py-10 md:py-14">
        <div className="rounded-[28px] border border-[#d8c7ae] bg-white/80 p-6 shadow-2xl shadow-[#8a6a3f]/10 backdrop-blur md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9b6b35]">
            Demo Production Flow
          </p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <h1 className="font-serif text-4xl font-black leading-tight md:text-6xl">
                Smoke test undangan digital dari order sampai RSVP.
              </h1>
              <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-[#6f6257]">
                Halaman ini memakai sample invitation sebagai jalur demo cepat untuk mengecek
                public renderer, personal guest link, preview admin, dan dashboard.
              </p>
            </div>
            <div className="rounded-[22px] bg-[#24160f] p-5 text-white">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/55">
                Current sample
              </p>
              <p className="mt-3 font-serif text-3xl font-black">
                {sampleInvitation.couple.groomNickname} & {sampleInvitation.couple.brideNickname}
              </p>
              <p className="mt-2 text-sm font-semibold text-white/65">
                Guest demo: {firstGuest}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {demoLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-[18px] border border-[#d8c7ae] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#9b6b35] hover:shadow-xl hover:shadow-[#8a6a3f]/10"
              >
                <p className="text-sm font-black text-[#24160f]">{item.label}</p>
                <p className="mt-2 text-xs font-semibold leading-5 text-[#6f6257]">
                  {item.detail}
                </p>
              </a>
            ))}
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-5">
            {flowSteps.map((step, index) => (
              <div key={step} className="rounded-[18px] bg-[#f5efe4] p-4">
                <p className="text-xs font-black text-[#9b6b35]">
                  STEP {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 text-sm font-bold leading-6 text-[#24160f]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#d8c7ae] bg-white">
        <div className="mx-auto max-w-[430px] border-x border-[#d8c7ae] bg-[#f9f4ec] shadow-2xl shadow-[#8a6a3f]/10">
          <DemoTemplateClient
            templateId={sampleInvitation.templateId}
            guestName={firstGuest}
            coverImage={sampleInvitation.coverImage}
          />
        </div>
      </section>
    </main>
  );
}
