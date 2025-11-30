"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Handle <a> clicks
  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target;
      const link = target.closest("a");

      if (
        link &&
        link.href &&
        link.origin === window.location.origin && // only same-origin links
        !link.hasAttribute("data-nprogress-disable") // allow opt-out
      ) {
        NProgress.start();
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  // Patch router.push and router.replace to show NProgress
  useEffect(() => {
    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = (...args) => {
      NProgress.start();
      return originalPush.apply(router, args);
    };

    router.replace = (...args) => {
      NProgress.start();
      return originalReplace.apply(router, args);
    };

  
    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
    };
  }, [router]);

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  return null;
}
