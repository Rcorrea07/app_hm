import { AppShell } from "@/components/shell/AppShell";

export default function LayoutApp({ children }: LayoutProps<"/app">) {
  return <AppShell>{children}</AppShell>;
}
