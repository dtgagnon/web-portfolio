
export default function ChatCard() {
  return (
    <div className="flex-col justify-center">
      <div className="text-4xl font-semibold mb-2">
        Derek Gagnon
      </div>
      <div className="text-sm/6 text-center font-[family-name:var(--font-geist-mono)] self-start">
        <a href="mailto:gagnon.derek@protonmail.com" className="hover:border-b border-dashed">
          gagnon.derek@protonmail.com
        </a>
      </div>
    </div>
  );
}