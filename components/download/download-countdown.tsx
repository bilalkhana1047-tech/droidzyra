"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Download,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export function DownloadCountdown({
  appName,
  versionName,
  downloadUrl,
}: {
  appName: string;
  versionName: string;
  downloadUrl: string;
}) {
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = window.setTimeout(() => {
      setSeconds((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [seconds]);

  const ready = seconds <= 0;

  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {ready ? (
          <CheckCircle2 className="h-8 w-8" />
        ) : (
          <Clock3 className="h-8 w-8" />
        )}
      </div>

      <h1 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
        {ready ? "Your download source is ready" : "Preparing download options"}
      </h1>

      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        {appName} v{versionName}
      </p>

      {!ready ? (
        <>
          <div className="mx-auto mt-8 flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary/15 bg-primary/[0.04]">
            <span className="text-3xl font-black text-primary">
              {seconds}
            </span>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Please wait {seconds} second{seconds !== 1 ? "s" : ""}.
          </p>
        </>
      ) : (
        <Button
          asChild
          size="lg"
          className="mt-8 h-12 rounded-xl px-7 font-bold shadow-lg shadow-primary/20"
        >
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <Download className="mr-2 h-5 w-5" />
            Continue to Download Source
          </a>
        </Button>
      )}

      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4 text-left">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

        <p className="text-xs leading-6 text-muted-foreground">
          DroidZyra does not host or automatically install APK files. You will be redirected to an external download source. Review the destination and file details before downloading.
        </p>
      </div>
    </div>
  );
}

