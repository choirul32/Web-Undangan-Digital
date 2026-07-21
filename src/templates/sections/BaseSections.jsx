import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SectionFrame, SectionTitle, fadeUp, profileImageClass, profileNameClass } from "../utils/templateStyling";
import CopyAccountNumber from "../components/CopyAccountNumber";
import { decodeWishMessage, wishReactionOptions } from "../utils/wishes";

function instagramUrl(value = "") {
  const rawValue = String(value || "").trim();
  if (!rawValue) return "";
  if (/^https?:\/\//i.test(rawValue)) return rawValue;

  const username = rawValue.replace(/^@/, "").replace(/^instagram\.com\//i, "");
  return username ? `https://instagram.com/${username}` : "";
}

export function CoupleSection({ designConfig, couple, coupleConfig, profileImages }) {
  const brideImage = profileImages?.bride || profileImages?.[1] || profileImages?.[0] || "/assets/catin_wanita.jpg";
  const groomImage = profileImages?.groom || profileImages?.[2] || profileImages?.[1] || "/assets/catin_pria.jpg";
  const profiles = [
    {
      name: couple.brideName,
      image: brideImage,
      parentText: couple.brideParents ? `Putri dari ${couple.brideParents}` : "",
      instagram: instagramUrl(couple.brideInstagram),
    },
    {
      name: couple.groomName,
      image: groomImage,
      parentText: couple.groomParents ? `Putra dari ${couple.groomParents}` : "",
      instagram: instagramUrl(couple.groomInstagram),
    },
  ].filter((profile) => profile.name);
  const cardBackgroundMode = coupleConfig.cardBackgroundMode || "color";
  const hasCardBackgroundImage = cardBackgroundMode === "image" && coupleConfig.cardBackgroundImage;
  const articleStyle =
    coupleConfig.cardEnabled === false
      ? {
          backgroundColor: "transparent",
          backgroundImage: "none",
          borderColor: "transparent",
          boxShadow: "none",
        }
      : {
          backgroundColor: hasCardBackgroundImage ? undefined : coupleConfig.cardBackgroundColor || "#ffffff",
          backgroundImage: hasCardBackgroundImage ? `url(${coupleConfig.cardBackgroundImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        };
  const articleClass =
    coupleConfig.cardEnabled === false
      ? "text-center"
      : "relative overflow-hidden rounded-[8px] border border-[var(--color-accent-pale)] p-7 text-center shadow-xl shadow-[var(--color-primary)]/8";

  return (
    <SectionFrame section="couple" designConfig={designConfig} baseClassName="bg-[var(--color-surface)]">
      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionTitle
          title="BRIDE & GROOM"
          desc="Tanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {profiles.map((profile) => (
            <motion.article key={profile.name} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={fadeUp} className={articleClass} style={articleStyle}>
              {hasCardBackgroundImage ? <div className="absolute inset-0 bg-white/72" /> : null}
              <div className="relative z-10">
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
              {coupleConfig.instagramEnabled && profile.instagram ? (
                <a
                  href={profile.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-sm font-black text-[var(--color-primary)]"
                >
                  Instagram
                </a>
              ) : null}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}

export function GiftSection({ accounts = [], designConfig, qrisImage = "" }) {
  const [isQrisOpen, setIsQrisOpen] = useState(false);

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
            className="mx-auto mt-10 max-w-sm overflow-hidden rounded-[8px] border border-[var(--color-accent-pale)] bg-white text-center shadow-lg shadow-[var(--color-primary)]/8"
          >
            <button
              type="button"
              onClick={() => setIsQrisOpen((current) => !current)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--color-accent)]/10"
              aria-expanded={isQrisOpen}
              aria-controls="gift-qris-panel"
            >
              <span>
                <span className="block text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]">
                  QRIS
                </span>
                <span className="mt-1 block text-sm font-semibold leading-6 text-[var(--color-text)]/70">
                  Buka untuk scan pembayaran digital.
                </span>
              </span>
              <span
                className="shrink-0 rounded-full border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-[var(--color-primary)]"
                aria-hidden="true"
              >
                {isQrisOpen ? "Hidden" : "Show"}
              </span>
            </button>
            {isQrisOpen ? (
              <div id="gift-qris-panel" className="border-t border-[var(--color-accent-pale)] px-6 pb-6 pt-5">
                <img
                  src={qrisImage}
                  alt="QRIS pembayaran"
                  className="mx-auto w-full max-w-[260px] rounded-lg object-contain"
                />
                <p className="mt-3 text-sm font-semibold leading-6 text-[var(--color-text)]">
                  Scan untuk mengirim hadiah lewat e-wallet atau m-banking apa pun (GoPay, OVO, DANA, ShopeePay, dll).
                </p>
              </div>
            ) : null}
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

export function WishesSection({ designConfig, slug = "", preview = false, framed = true }) {
  const [wishes, setWishes] = useState(null);
  const [reactions, setReactions] = useState({});
  const [activeReactionWishId, setActiveReactionWishId] = useState("");
  const reactionStorageKey = slug ? `nusa-invite:wish-reactions:${slug}` : "";

  useEffect(() => {
    if (preview || !slug) return undefined;

    let isMounted = true;
    const loadWishes = () => {
      fetch(`/api/public/wishes/${encodeURIComponent(slug)}?t=${Date.now()}`, {
        cache: "no-store",
      })
      .then((response) => response.json())
      .then((result) => {
        if (isMounted) {
          setWishes(Array.isArray(result?.data) ? result.data : []);
        }
      })
      .catch(() => {
        if (isMounted) setWishes([]);
      });
    };

    const handleRefresh = (event) => {
      if (event.detail?.invitationSlug && event.detail.invitationSlug !== slug) {
        return;
      }

      if (event.detail?.wish?.message) {
        const nextWish = event.detail.wish;
        setWishes((current) => {
          const currentList = Array.isArray(current) ? current : [];
          return [
            nextWish,
            ...currentList.filter((item) => item.id !== nextWish.id),
          ];
        });
      }

      loadWishes();
    };

    loadWishes();
    window.addEventListener("nusa-invite:wishes-refresh", handleRefresh);

    return () => {
      isMounted = false;
      window.removeEventListener("nusa-invite:wishes-refresh", handleRefresh);
    };
  }, [preview, slug]);

  useEffect(() => {
    if (!reactionStorageKey || typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem(reactionStorageKey);
      setReactions(stored ? JSON.parse(stored) : {});
    } catch {
      setReactions({});
    }
  }, [reactionStorageKey]);

  const updateReaction = (wishId, reactionId) => {
    if (!wishId) return;

    setActiveReactionWishId("");
    setReactions((current) => {
      const currentWishReactions = current[wishId] || {};
      const next = {
        ...current,
        [wishId]: {
          ...currentWishReactions,
          [reactionId]: Number(currentWishReactions[reactionId] || 0) + 1,
        },
      };

      if (reactionStorageKey && typeof window !== "undefined") {
        try {
          window.localStorage.setItem(reactionStorageKey, JSON.stringify(next));
        } catch {
          // Reactions are decorative, so storage failure should not break wishes.
        }
      }

      return next;
    });
  };

  const getReactionSummary = (wishId) => {
    const itemReactions = reactions[wishId] || {};
    const entries = wishReactionOptions
      .map((reaction) => ({
        ...reaction,
        count: Number(itemReactions[reaction.id] || 0),
      }))
      .filter((reaction) => reaction.count > 0);
    const total = entries.reduce((sum, reaction) => sum + reaction.count, 0);

    return {
      total,
      icons: entries.slice(0, 3).map((reaction) => reaction.icon),
    };
  };

  const previewWishes = [
    {
      id: "preview-wish-1",
      name: "Rani & Keluarga",
      message:
        "Selamat menempuh hidup baru. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah dan selalu dilimpahi kebahagiaan.",
    },
    {
      id: "preview-wish-2",
      name: "Bapak Arif",
      message:
        "Barakallah untuk kedua mempelai. Semoga acara berjalan lancar dan menjadi awal perjalanan rumah tangga yang penuh berkah.",
    },
    {
      id: "preview-wish-3",
      name: "Sahabat Kampus",
      message:
        "Akhirnya sampai juga di hari bahagia. Semoga Dimas dan Salsa selalu kompak, saling menjaga, dan bahagia selamanya.",
    },
    {
      id: "preview-wish-4",
      name: "Ibu Lina",
      message:
        "Turut berbahagia atas pernikahannya. Semoga cinta dan doa keluarga selalu mengiringi setiap langkah kalian.",
    },
  ];
  const list = (wishes || (preview ? previewWishes : [])).map((wish) => {
    const decoded = decodeWishMessage(wish.message);

    return {
      ...wish,
      message: decoded.message || wish.message,
      sticker: wish.sticker || decoded.sticker,
    };
  });

  const content = (
    <div className="relative z-10 mx-auto max-w-4xl text-center">
        <SectionTitle eyebrow="Doa & Ucapan" title="Kirimkan doa terbaik" />
        {list.length === 0 ? (
          <div className="mt-10">
            <p className="text-base font-semibold leading-7 text-[var(--color-text)]/70">
              Belum ada ucapan. Jadilah yang pertama mengirim doa terbaik untuk kedua mempelai.
            </p>
            {preview ? (
              <p className="mx-auto mt-3 max-w-md rounded-[8px] border border-dashed border-[var(--color-accent-pale)] bg-[var(--color-surface)]/70 px-4 py-3 text-sm font-semibold leading-6 text-[var(--color-text)]/60">
                Catatan pratinjau: ucapan diambil dari pesan konfirmasi tamu. Section ini terisi otomatis setelah undangan dipublish dan tamu mengirim konfirmasi.
              </p>
            ) : null}
          </div>
        ) : (
          <div className="mx-auto mt-10 max-w-2xl space-y-4">
            {list.map((wish, index) => (
              <motion.div
                key={wish.id || `wish-${index}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                variants={fadeUp}
                className="relative rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] p-5 text-left shadow-lg shadow-[var(--color-primary)]/8"
              >
                {wish.sticker ? (
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-accent-pale)] bg-[var(--color-accent)]/12 px-3 py-1.5 text-xs font-black text-[var(--color-primary)]">
                    <span aria-hidden="true">{wish.sticker.icon}</span>
                    {wish.sticker.label}
                  </div>
                ) : null}
                <p className="text-base font-semibold leading-7 text-[var(--color-text)]">&ldquo;{wish.message}&rdquo;</p>
                <p className="mt-4 text-sm font-black text-[var(--color-primary)]">— {wish.name}</p>
                <div className="relative mt-5 flex items-center justify-between gap-3 border-t border-[var(--color-accent-pale)] pt-4">
                  {(() => {
                    const summary = getReactionSummary(wish.id);

                    return (
                      <div className="flex min-h-8 items-center gap-2 text-xs font-black text-[var(--color-text)]/65">
                        {summary.total > 0 ? (
                          <>
                            <span className="flex -space-x-1">
                              {summary.icons.map((icon) => (
                                <span
                                  key={icon}
                                  className="grid h-6 w-6 place-items-center rounded-full border border-white bg-white text-sm shadow-sm"
                                  aria-hidden="true"
                                >
                                  {icon}
                                </span>
                              ))}
                            </span>
                            <span>{summary.total}</span>
                          </>
                        ) : (
                          <span>Belum ada reaksi</span>
                        )}
                      </div>
                    );
                  })()}
                  <button
                    type="button"
                    onClick={() =>
                      setActiveReactionWishId((current) =>
                        current === wish.id ? "" : wish.id,
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent-pale)] bg-white/85 px-3 py-2 text-xs font-black text-[var(--color-primary)] transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/12"
                    aria-expanded={activeReactionWishId === wish.id}
                    aria-label={`Beri reaksi untuk ucapan ${wish.name}`}
                  >
                    <span aria-hidden="true">{"\uD83D\uDC4D"}</span>
                    Reaksi
                  </button>
                  {activeReactionWishId === wish.id ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="absolute bottom-14 right-0 z-20 flex gap-1 rounded-full border border-[var(--color-accent-pale)] bg-white px-2 py-1.5 shadow-2xl shadow-[var(--color-primary)]/18"
                    >
                      {wishReactionOptions.map((reaction) => (
                        <button
                          key={reaction.id}
                          type="button"
                          onClick={() => updateReaction(wish.id, reaction.id)}
                          className="grid h-10 w-10 place-items-center rounded-full text-xl transition-transform hover:-translate-y-1 hover:scale-110 hover:bg-[var(--color-accent)]/12"
                          title={reaction.label}
                          aria-label={`${reaction.label} untuk ucapan ${wish.name}`}
                        >
                          <span aria-hidden="true">{reaction.icon}</span>
                        </button>
                      ))}
                    </motion.div>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
  );

  if (!framed) {
    return <div className="mt-12">{content}</div>;
  }

  return (
    <SectionFrame section="doa-ucapan" designConfig={designConfig} baseClassName="bg-[var(--color-section-soft)]">
      {content}
    </SectionFrame>
  );
}
