"use client";

import LayoutOne from "@/components/layout/layout-one";
import useInitialData from "@/hooks/useInitialData";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch initial data when the app loads
  useInitialData();

  return <LayoutOne>{children}</LayoutOne>;
}
