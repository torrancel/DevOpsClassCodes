import { useState } from "react";
import { Twitter, Linkedin, Mail, Link as LinkIcon, Check } from "lucide-react";
import { toast } from "sonner";

/**
 * Share buttons for the founder story (or any page).
 * Falls back gracefully: Web Share API on mobile, copy-link everywhere.
 */
export default function ShareButtons({
    url,
    title = "Why I Built Let It Go AI",
    summary = "Founder letter from Torrance Lillie — the world's first Emotional Intelligence Operating System.",
    quote = "In 2022, my life fell apart. I built the thing I wish I'd had.",
}) {
    const [copied, setCopied] = useState(false);
    const shareUrl = typeof window !== "undefined" && !url ? window.location.href : url;

    // X / Twitter intent — short, attribution-friendly. Twitter prepends the URL.
    const twitterText = `"${quote}"\n\n${title} — a founder letter behind Let It Go AI.\n\nRead it →`;
    const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}`;

    // LinkedIn — uses the share-offsite endpoint
    const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

    // Email — subject + body opens user's mail client
    const emailBody = `${summary}\n\nRead it: ${shareUrl}`;
    const mailtoHref = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(emailBody)}`;

    const openPopup = (href) => () => {
        if (typeof window !== "undefined") {
            window.open(href, "_blank", "noopener,noreferrer,width=600,height=600");
        }
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success("Link copied.");
            setTimeout(() => setCopied(false), 2400);
        } catch {
            toast.error("Couldn't copy. Try long-pressing the URL bar instead.");
        }
    };

    // Native share on mobile (one-tap to iOS / Android share sheet)
    const tryNativeShare = async () => {
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({ title, text: summary, url: shareUrl });
                return true;
            } catch {
                // user cancelled — fall through silently
            }
        }
        return false;
    };

    const buttons = [
        {
            key: "twitter",
            label: "Post on X",
            Icon: Twitter,
            onClick: openPopup(twitterHref),
            testId: "founder-share-twitter",
        },
        {
            key: "linkedin",
            label: "LinkedIn",
            Icon: Linkedin,
            onClick: openPopup(linkedinHref),
            testId: "founder-share-linkedin",
        },
        {
            key: "email",
            label: "Email",
            Icon: Mail,
            onClick: () => {
                if (typeof window !== "undefined") window.location.href = mailtoHref;
            },
            testId: "founder-share-email",
        },
        {
            key: "copy",
            label: copied ? "Copied" : "Copy link",
            Icon: copied ? Check : LinkIcon,
            onClick: async () => {
                const usedNative = await tryNativeShare();
                if (!usedNative) await copyLink();
            },
            testId: "founder-share-copy",
        },
    ];

    return (
        <div data-testid="founder-share" className="mt-12 md:mt-16">
            <p className="text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-4">
                Share this letter
            </p>
            <div className="flex flex-wrap gap-2 md:gap-3">
                {buttons.map(({ key, label, Icon, onClick, testId }) => (
                    <button
                        key={key}
                        type="button"
                        onClick={onClick}
                        data-testid={testId}
                        aria-label={label}
                        className="group inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] hover:bg-white/[0.08] hover:border-violet/40 text-ink-soft hover:text-ink px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors"
                    >
                        <Icon size={13} strokeWidth={1.7} className="transition-transform group-hover:scale-110" />
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}
