import { NavDoc } from "@/screens/doc/NavDoc";

export default function LayoutDoc({ children }: LayoutProps<"/doc">) {
  return (
    <div className="doc min-h-dvh bg-zinc-200 text-zinc-900">
      <NavDoc />
      <main className="px-0 pb-12 pt-4 sm:px-6">{children}</main>
    </div>
  );
}
