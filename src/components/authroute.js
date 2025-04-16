"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

export default function AuthRoute({ children, redirectTo }) {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push(redirectTo);
  }

  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}