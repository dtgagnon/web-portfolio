
export default function ChatCard() {
  return (
    <div>
        <div className="text-2xl font-semibold mb-2">
          Derek Gagnon
        </div>
      <div className="text-sm/6 text-center sm:text-right font-[family-name:var(--font-geist-sans)] self-start">
        <a href="mailto:gagnon.derek@protonmail.com" className="hover:border-b border-dashed">
          gagnon.derek@protonmail.com
        </a>
      </div>
    </div>
  );
}