"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Protected({ children, redirectTo }) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push(redirectTo);
  }

  return <>{children}</>;
}