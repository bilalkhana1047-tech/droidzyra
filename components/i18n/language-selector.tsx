"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Check,
  ChevronDown,
  Globe2,
  Search,
} from "lucide-react";

import { languages } from "@/lib/i18n/languages";
import { useLanguage } from "@/components/i18n/language-provider";
import { cn } from "@/lib/utils";

type LanguageSelectorProps = {
  fullWidth?: boolean;
};

export function LanguageSelector({
  fullWidth = false,
}: LanguageSelectorProps) {
  const {
    language,
    languageCode,
    setLanguage,
  } = useLanguage();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  const filteredLanguages = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return languages;
    }

    return languages.filter((item) => {
      return (
        item.name.toLowerCase().includes(normalized) ||
        item.nativeName.toLowerCase().includes(normalized) ||
        item.code.toLowerCase().includes(normalized)
      );
    });
  }, [query]);

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "relative",
        fullWidth && "w-full"
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex h-10 items-center justify-between gap-2 rounded-xl border border-border/70 bg-background px-3 text-xs font-semibold text-foreground shadow-sm transition hover:bg-muted/50",
          fullWidth ? "w-full" : "min-w-[132px]"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
      >
        <span className="flex min-w-0 items-center gap-2">
          <Globe2 className="h-4 w-4 shrink-0 text-primary" />

          <span className="truncate">
            {language.nativeName}
          </span>
        </span>

        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          className={cn(
            "absolute z-[100] mt-2 overflow-hidden rounded-2xl border border-border/70 bg-background shadow-2xl",
            fullWidth
              ? "left-0 right-0"
              : "right-0 w-[310px]"
          )}
        >
          <div className="border-b border-border/60 p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="search"
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="Search language..."
                className="h-10 w-full rounded-xl border border-border/70 bg-muted/30 pl-9 pr-3 text-sm outline-none transition focus:border-primary/30 focus:bg-background focus:ring-4 focus:ring-primary/[0.07]"
                autoFocus
              />
            </div>
          </div>

          <div
            className="max-h-[360px] overflow-y-auto p-2"
            role="listbox"
            aria-label="Languages"
          >
            {filteredLanguages.length === 0 ? (
              <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                No language found.
              </div>
            ) : (
              filteredLanguages.map((item) => {
                const selected =
                  item.code === languageCode;

                return (
                  <button
                    type="button"
                    key={item.code}
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      setLanguage(item.code);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
                      selected
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    )}
                  >
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-semibold">
                        {item.nativeName}
                      </span>

                      <span className="truncate text-xs text-muted-foreground">
                        {item.name}
                      </span>
                    </span>

                    {selected && (
                      <Check className="h-4 w-4 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
