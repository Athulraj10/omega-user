"use client";

import LayoutOne from "@/components/layout/layout-one";
import useInitialData from "@/hooks/useInitialData";

interface ClientMainLayoutProps {
  children: React.ReactNode;
}

export default function ClientMainLayout({ children }: ClientMainLayoutProps) {
  // Fetch initial data when the app loads
  useInitialData();

  return <LayoutOne>{children}</LayoutOne>;
} 