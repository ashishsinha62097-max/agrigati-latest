import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronDown, Globe } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { INDIAN_LANGUAGES } from "../data/languages";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 rounded-full px-3 py-1.5 transition-all duration-200 border border-white/20"
        >
          <Globe className="w-3.5 h-3.5 text-white" />
          <span className="text-white text-xs font-bold hidden sm:block">
            {language.nativeName}
          </span>
          <span className="text-white text-xs font-bold sm:hidden">
            {language.flag}
          </span>
          <ChevronDown className="w-3 h-3 text-white/70" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-h-[85vh] overflow-y-auto"
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="font-display font-bold text-lg flex items-center gap-2">
            <Globe className="w-5 h-5 text-teal-600" />
            Bhasha Chunein / Select Language
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            Apni pasandida bhasha chunein
          </p>
        </SheetHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pb-8">
          {INDIAN_LANGUAGES.map((lang) => {
            const isSelected = lang.code === language.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang);
                  setOpen(false);
                }}
                className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? "border-teal-500 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-md"
                    : "border-border bg-white hover:border-teal-200 hover:bg-teal-50/50"
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <div className="min-w-0">
                  <p
                    className={`text-sm font-bold truncate ${isSelected ? "text-teal-700" : "text-foreground"}`}
                  >
                    {lang.nativeName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {lang.name}
                  </p>
                </div>
                {isSelected && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
