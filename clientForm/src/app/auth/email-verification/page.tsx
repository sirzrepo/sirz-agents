import { Suspense } from "react";
import EmailVerification from "./emailVerification";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <EmailVerification />
    </Suspense>
  );
}
