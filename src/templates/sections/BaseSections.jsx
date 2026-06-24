import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SectionFrame, SectionTitle, fadeUp, profileImageClass, profileNameClass } from "../utils/templateStyling";
import CopyAccountNumber from "../components/CopyAccountNumber";

export function CoupleSection({ designConfig, couple, coupleConfig, profileImages }) {
  const brideImage = profileImages?.bride || profileImages?.[1] || profileImages?.[0] || "/assets/catin_wanita.jpg";
  const groomImage = profileImages?.groom || profileImages?.[2] || profileImages?.[1] || "/assets/catin_pria.jpg";
  const profiles = [
    {
      name: couple.brideName,
      image: brideImage,
      parentText: couple.brideParents ? `Putri dari ${couple.brideParents}` : "",
    },
    {
      name: couple.groomName,
      image: groomImage,
      parentText: couple.groomParents ? `Putra dari ${couple.groomParents}` : "",
    },
  ].filter((profile) => profile.name);

  return (
    <SectionFrame section="couple" designConfig={designConfig} baseClassName="bg-[var(--color-surface)]">
      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionTitle
          title="BRIDE & GROOM"
          desc="Tanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {profiles.map((profile) => (
            <motion.article key={profile.name} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={fadeUp} className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-7 text-center shadow-xl shadow-[var(--color-primary)]/8">
              {coupleConfig.photoEnabled ? <img src={profile.image} alt={profile.name} className={profileImageClass(coupleConfig)} /> : null}
              <h3 className={profileNameClass(coupleConfig)}>{profile.name}</h3>
              {coupleConfig.parentTextEnabled && profile.parentText ? (
                <div className="mx-auto mt-4 max-w-sm border-t border-[var(--color-accent-pale)] pt-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                    {profile.parentText.startsWith("Putri") ? "Putri dari" : "Putra dari"}
                  </p>
                  <p className="mt-2 text-base font-semibold leading-7 text-[var(--color-text)]">
                    {profile.parentText.replace(/^Putri dari\s*/i, "").replace(/^Putra dari\s*/i, "")}
                  </p>
                </div>
              ) : null}
              {coupleConfig.instagramEnabled ? <a className="mt-5 inline-flex rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-sm font-black text-[var(--color-primary)]">Instagram</a> : null}
            </motion.article>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}

export function GiftSection({ accounts = [], designConfig, qrisImage = "" }) {
  if (!accounts.length && !qrisImage) return null;
  return (
    <SectionFrame section="gift" designConfig={designConfig} baseClassName="bg-[var(--color-surface)]">
      <div className="relative z-10 mx-auto max-w-5xl">
        <SectionTitle eyebrow="Amplop Digital" title="Doa restu adalah hadiah terbaik." desc="Bagi keluarga dan sahabat yang ingin mengirimkan tanda kasih, rekening dan QRIS tersedia di bawah ini." />
        {qrisImage ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="mx-auto mt-10 max-w-sm rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-6 text-center shadow-lg shadow-[var(--color-primary)]/8"
          >
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]">QRIS</p>
            <img
              src={qrisImage}
              alt="QRIS pembayaran"
              className="mx-auto mt-4 w-full max-w-[260px] rounded-lg object-contain"
            />
            <p className="mt-3 text-sm font-semibold leading-6 text-[var(--color-text)]">
              Scan untuk mengirim hadiah lewat e-wallet atau m-banking apa pun (GoPay, OVO, DANA, ShopeePay, dll).
            </p>
          </motion.div>
        ) : null}
        {accounts.length ? (
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {accounts.map((account) => (
            <motion.div key={`${account.bank}-${account.number}`} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-6 shadow-lg shadow-[var(--color-primary)]/8">
              <div className="flex min-h-12 items-center justify-between gap-4">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]">{account.bank}</p>
                {account.logoUrl ? (
                  <img
                    src={account.logoUrl}
                    alt={`Logo ${account.bank}`}
                    className="h-10 w-24 object-contain object-right"
                  />
                ) : null}
              </div>
              <div className="mt-3">
                <CopyAccountNumber bank={account.bank} number={account.number} />
              </div>
              <p className="mt-2 text-base font-semibold text-[var(--color-text)]">a.n. {account.name}</p>
            </motion.div>
          ))}
        </div>
        ) : null}
      </div>
    </SectionFrame>
  );
}

export function WishesSection({ designConfig, slug = "", preview = false }) {
  const [wishes, setWishes] = useState(null);

  useEffect(() => {
    if (preview || !slug) return undefined;

    let isMounted = true;
    fetch(`/api/public/wishes/${encodeURIComponent(slug)}`)
      .then((response) => response.json())
      .then((result) => {
        if (isMounted) {
          setWishes(Array.isArray(result?.data) ? result.data : []);
        }
      })
      .catch(() => {
        if (isMounted) setWishes([]);
      });

    return () => {
      isMounted = false;
    };
  }, [preview, slug]);

  const list = wishes || [];

  return (
    <SectionFrame section="doa-ucapan" designConfig={designConfig} baseClassName="bg-[var(--color-section-soft)]">
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <SectionTitle eyebrow="Doa & Ucapan" title="Kirimkan doa terbaik" />
        {list.length === 0 ? (
          <div className="mt-10">
            <p className="text-base font-semibold leading-7 text-[var(--color-text)]/70">
              Belum ada ucapan. Jadilah yang pertama mengirim doa terbaik untuk kedua mempelai.
            </p>
            {preview ? (
              <p className="mx-auto mt-3 max-w-md rounded-[8px] border border-dashed border-[var(--color-accent-pale)] bg-[var(--color-surface)]/70 px-4 py-3 text-sm font-semibold leading-6 text-[var(--color-text)]/60">
                Catatan pratinjau: ucapan diambil dari pesan RSVP tamu. Section ini terisi otomatis setelah undangan dipublish dan tamu mengirim RSVP.
              </p>
            ) : null}
          </div>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {list.map((wish, index) => (
              <motion.div key={wish.id || `wish-${index}`} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={fadeUp} className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] p-6 text-left shadow-lg shadow-[var(--color-primary)]/8">
                <p className="text-base font-semibold leading-7 text-[var(--color-text)]">&ldquo;{wish.message}&rdquo;</p>
                <p className="mt-4 text-sm font-black text-[var(--color-primary)]">— {wish.name}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </SectionFrame>
  );
}

