import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DroidZyra AI — Coming Soon",
  description:
    "DroidZyra AI is currently being prepared for public release.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function AILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
