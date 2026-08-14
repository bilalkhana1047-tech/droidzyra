import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DroidZyra Admin",
  description: "Private administration area for authorized DroidZyra administrators.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
