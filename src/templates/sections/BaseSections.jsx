import { motion } from "framer-motion";
import { SectionFrame, SectionTitle, fadeUp, profileImageClass, profileNameClass } from "../utils/templateStyling";

export function CoupleSection({ designConfig, couple, coupleConfig, profileImages }) {
  return (
    <SectionFrame section="couple" designConfig={designConfig} baseClassName="bg-[var(--color-surface)]">
      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionTitle eyebrow="Mempelai" title={`${couple.groomName} & ${couple.brideName}`} />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {[
            { name: couple.brideName, image: profileImages[1], role: "Mempelai Wanita" },
            { name: couple.groomName, image: profileImages[2], role: "Mempelai Pria" },
          ].map((profile) => (
            <motion.article key={profile.name} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={fadeUp} className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-7 text-center shadow-xl shadow-[var(--color-primary)]/8">
              {coupleConfig.photoEnabled ? <img src={profile.image} alt={profile.name} className={profileImageClass(coupleConfig)} /> : null}
              <h3 className={profileNameClass(coupleConfig)}>{profile.name}</h3>
              {coupleConfig.parentTextEnabled ? <p className="mt-3 text-base font-semibold text-[var(--color-text)]">{profile.role}</p> : null}
              {coupleConfig.instagramEnabled ? <a className="mt-5 inline-flex rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-sm font-black text-[var(--color-primary)]">Instagram</a> : null}
            </motion.article>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}

export function GiftSection({ accounts = [], designConfig }) {
  if (!accounts.length) return null;
  return (
    <SectionFrame section="gift" designConfig={designConfig} baseClassName="bg-[var(--color-surface)]">
      <div className="relative z-10 mx-auto max-w-5xl">
        <SectionTitle eyebrow="Amplop Digital" title="Doa restu adalah hadiah terbaik." desc="Bagi keluarga dan sahabat yang ingin mengirimkan tanda kasih, rekening tersedia di bawah ini." />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {accounts.map((account) => (
            <motion.div key={`${account.bank}-${account.number}`} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-6 shadow-lg shadow-[var(--color-primary)]/8">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]">{account.bank}</p>
              <p className="mt-3 text-2xl font-black text-[var(--color-primary)]">{account.number}</p>
              <p className="mt-2 text-base font-semibold text-[var(--color-text)]">a.n. {account.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}

export function WishesSection({ designConfig }) {
  const wishes = [
    { name: "Bapak Andi", message: "Selamat menempuh hidup baru, semoga menjadi keluarga yang sakinah mawaddah warahmah. Aamiin." },
    { name: "Ibu Sari", message: "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fi khair." },
    { name: "Rizky & Hana", message: "Semoga pernikahan ini menjadi awal kebahagiaan yang abadi. Selamat ya!" },
    { name: "Keluarga Besar", message: "Doa kami selalu menyertai langkah kalian berdua. Semoga diberkahi selalu." },
  ];

  return (
    <SectionFrame section="doa-ucapan" designConfig={designConfig} baseClassName="bg-[var(--color-section-soft)]">
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <SectionTitle eyebrow="Doa & Ucapan" title="Kirimkan doa terbaik" />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {wishes.map((wish, index) => (
            <motion.div key={`wish-${index}`} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={fadeUp} className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] p-6 text-left shadow-lg shadow-[var(--color-primary)]/8">
              <p className="text-base font-semibold leading-7 text-[var(--color-text)]">&ldquo;{wish.message}&rdquo;</p>
              <p className="mt-4 text-sm font-black text-[var(--color-primary)]">— {wish.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}

