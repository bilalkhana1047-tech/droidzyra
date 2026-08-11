'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Smartphone, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { androidVersions } from '@/lib/site';
import type { App, Category } from '@/lib/types';

export function CompatibilityFinderWidget({
  apps,
  categories,
  compact = false,
}: {
  apps?: App[];
  categories?: Category[];
  compact?: boolean;
}) {
  const router = useRouter();
  const [androidVersion, setAndroidVersion] = useState('');
  const [appId, setAppId] = useState('');
  const [appList, setAppList] = useState<App[]>(apps ?? []);
  const [loading, setLoading] = useState(!apps);

  useEffect(() => {
    if (apps) {
      setAppList(apps);
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      const { getApps } = await import('@/lib/data');
      const { apps: fetched } = await getApps({ limit: 50 });
      if (active) {
        setAppList(fetched);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [apps]);

  const canCheck = androidVersion && appId;

  const handleCheck = () => {
    if (!canCheck) return;
    const app = appList.find((a) => a.id === appId);
    if (app) {
      router.push(
        `/compatibility?app=${app.slug}&android=${androidVersion}`
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Smartphone className="h-4 w-4 text-primary" />
        Find a compatible version
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Your Android version
          </label>
          <Select value={androidVersion} onValueChange={setAndroidVersion}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Android version" />
            </SelectTrigger>
            <SelectContent>
              {androidVersions.map((v) => (
                <SelectItem key={v} value={v}>
                  Android {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Select an app
          </label>
          <Select value={appId} onValueChange={setAppId} disabled={loading}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={loading ? 'Loading apps…' : 'Select an app'}
              />
            </SelectTrigger>
            <SelectContent>
              {appList.map((app) => (
                <SelectItem key={app.id} value={app.id}>
                  {app.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={handleCheck}
        disabled={!canCheck}
        className="w-full gap-2"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle2 className="h-4 w-4" />
        )}
        Check Compatibility
        <ArrowRight className="h-4 w-4" />
      </Button>

      {!compact && (
        <p className="text-xs text-muted-foreground text-center">
          Results are based on structured compatibility data — no AI
          hallucinations.
        </p>
      )}
    </div>
  );
}
