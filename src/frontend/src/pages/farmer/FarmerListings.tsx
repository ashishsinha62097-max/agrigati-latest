import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Plus, Search, Sprout, Trash2, Upload } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";
import { useLanguage } from "../../context/LanguageContext";
import {
  CROP_DATABASE,
  type CropCategoryExtended,
  type CropItem,
  getCropEmoji,
  searchCrops,
} from "../../data/cropDatabase";
import type { TranslationKey } from "../../data/languages";
import type { CropCategory, Listing } from "../../types/marketplace";

type ExtendedCropCategory = CropCategory;

const categoryColor: Record<string, string> = {
  Vegetables: "bg-emerald-100 text-emerald-700",
  Fruits: "bg-orange-100 text-orange-700",
  Grains: "bg-amber-100 text-amber-700",
  Corn: "bg-yellow-100 text-yellow-700",
  Spices: "bg-red-100 text-red-700",
  Pulses: "bg-purple-100 text-purple-700",
  "Cash Crops": "bg-blue-100 text-blue-700",
};

const FILTER_TABS: {
  key: string;
  emoji: string;
  labelKey: TranslationKey;
  color: string;
}[] = [
  {
    key: "All",
    emoji: "🌿",
    labelKey: "allCrops",
    color: "from-teal-500 to-cyan-600",
  },
  {
    key: "Vegetables",
    emoji: "🥦",
    labelKey: "vegetables",
    color: "from-emerald-500 to-green-600",
  },
  {
    key: "Fruits",
    emoji: "🍎",
    labelKey: "fruits",
    color: "from-orange-400 to-red-500",
  },
  {
    key: "Grains",
    emoji: "🌾",
    labelKey: "grains",
    color: "from-amber-500 to-yellow-600",
  },
  {
    key: "Spices",
    emoji: "🌶️",
    labelKey: "spices",
    color: "from-red-500 to-rose-600",
  },
  {
    key: "Pulses",
    emoji: "🫘",
    labelKey: "pulses",
    color: "from-purple-500 to-violet-600",
  },
  {
    key: "Cash Crops",
    emoji: "💰",
    labelKey: "cashCrops",
    color: "from-blue-500 to-indigo-600",
  },
  {
    key: "Corn",
    emoji: "🌽",
    labelKey: "corn",
    color: "from-yellow-400 to-orange-500",
  },
];

interface ListingFormData {
  cropName: string;
  cropEmoji: string;
  category: CropCategoryExtended | "";
  quantity: string;
  pricePerKg: string;
  description: string;
  location: string;
  photoUrl: string;
}

const emptyForm: ListingFormData = {
  cropName: "",
  cropEmoji: "🌱",
  category: "",
  quantity: "",
  pricePerKg: "",
  description: "",
  location: "",
  photoUrl: "",
};

// Crop Autocomplete Input
function CropAutocomplete({
  value,
  onChange,
}: {
  value: string;
  onChange: (crop: CropItem) => void;
}) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<CropItem[]>([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    if (q.length >= 1) {
      setSuggestions(searchCrops(q));
      setOpen(true);
    } else {
      setSuggestions([]);
      setOpen(false);
    }
  };

  const handleSelect = (crop: CropItem) => {
    setQuery(crop.name);
    setSuggestions([]);
    setOpen(false);
    onChange(crop);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder="Fasal ka naam likhein..."
          value={query}
          onChange={handleInput}
          onFocus={() => {
            if (query.length >= 1) setOpen(true);
            else if (query === "" && CROP_DATABASE.length > 0) {
              setSuggestions(CROP_DATABASE.slice(0, 8));
              setOpen(true);
            }
          }}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          required
          className="pl-8"
        />
      </div>
      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-border rounded-xl shadow-card-hover max-h-48 overflow-y-auto">
          {suggestions.map((crop) => (
            <button
              key={`${crop.name}-${crop.category}`}
              type="button"
              onMouseDown={() => handleSelect(crop)}
              className="w-full text-left px-3 py-2 hover:bg-emerald-50 flex items-center gap-2 border-b border-border/50 last:border-0 transition-colors"
            >
              <span className="text-xl">{crop.emoji}</span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate">
                  {crop.name}
                </p>
                {crop.nameHindi && (
                  <p className="text-[10px] text-muted-foreground">
                    {crop.nameHindi}
                  </p>
                )}
              </div>
              <span
                className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-lg font-bold flex-shrink-0 ${categoryColor[crop.category] ?? "bg-gray-100 text-gray-600"}`}
              >
                {crop.category}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FarmerListings() {
  const { currentUser, listings, addListing, updateListing, deleteListing } =
    useApp();
  const { t } = useLanguage();
  const myListings = listings.filter((l) => l.farmerId === currentUser?.id);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ListingFormData>(emptyForm);
  const [filterCategory, setFilterCategory] = useState<
    ExtendedCropCategory | "All"
  >("All");

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (listing: Listing) => {
    setEditingId(listing.id);
    setForm({
      cropName: listing.cropName,
      cropEmoji: listing.cropEmoji,
      category: listing.category as CropCategoryExtended,
      quantity: String(listing.quantity),
      pricePerKg: String(listing.pricePerKg),
      description: listing.description,
      location: listing.farmerLocation,
      photoUrl: listing.photoUrl ?? "",
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category) {
      toast.error("Please select a category");
      return;
    }

    if (editingId) {
      updateListing(editingId, {
        cropName: form.cropName,
        cropEmoji: form.cropEmoji || getCropEmoji(form.cropName),
        category: form.category as CropCategory,
        quantity: Number(form.quantity),
        pricePerKg: Number(form.pricePerKg),
        description: form.description,
        farmerLocation: form.location,
        photoUrl: form.photoUrl,
      });
      toast.success(t("listingUpdated"));
    } else {
      addListing({
        farmerId: currentUser?.id ?? "",
        farmerName: currentUser?.name ?? "",
        farmerLocation:
          form.location ||
          `${(currentUser as { district?: string })?.district ?? ""}, India`,
        cropName: form.cropName,
        cropEmoji: form.cropEmoji || getCropEmoji(form.cropName),
        category: form.category as CropCategory,
        quantity: Number(form.quantity),
        pricePerKg: Number(form.pricePerKg),
        description: form.description,
        available: true,
        photoUrl: form.photoUrl,
      });
      toast.success(t("cropListed"));
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Is listing ko hataayen?")) {
      deleteListing(id);
      toast.success(t("listingDeleted"));
    }
  };

  const filteredListings = myListings.filter(
    (l) => filterCategory === "All" || l.category === filterCategory,
  );

  return (
    <div className="px-4 py-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-black text-xl text-foreground">
            {t("myCrops")}
          </h2>
          <p className="text-xs text-muted-foreground font-body">
            {filteredListings.length} listings
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold gap-2 rounded-xl shadow-card"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          {t("addCrop")}
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {FILTER_TABS.map((tab) => {
          const isActive = filterCategory === tab.key;
          return (
            <motion.button
              key={tab.key}
              type="button"
              onClick={() =>
                setFilterCategory(tab.key as ExtendedCropCategory | "All")
              }
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={`flex-shrink-0 text-xs font-display font-bold py-2 px-3 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                isActive
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-card`
                  : "bg-white text-foreground border border-border hover:border-teal-200 hover:bg-teal-50/50"
              }`}
            >
              {tab.emoji} {t(tab.labelKey)}
            </motion.button>
          );
        })}
      </div>

      {/* Listings */}
      {myListings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="text-7xl mb-4">🌱</div>
          <p className="font-display font-bold text-lg text-foreground mb-2">
            {t("noListings")}
          </p>
          <p className="text-muted-foreground text-sm font-body mb-6">
            {t("addFirstCrop")}
          </p>
          <Button
            onClick={openAdd}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("addCrop")}
          </Button>
        </motion.div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">🔍</div>
          <p className="font-display font-bold text-base text-foreground mb-1">
            {t("noFilterListings")}
          </p>
          <p className="text-muted-foreground text-sm font-body">
            {t("addToFilterCat")}
          </p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-3">
            {filteredListings.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -2 }}
                className="bg-white rounded-2xl border border-border p-4 shadow-card"
              >
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-2xl flex-shrink-0 overflow-hidden shadow-sm border border-emerald-100">
                    {listing.photoUrl ? (
                      <img
                        src={listing.photoUrl}
                        alt={listing.cropName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-3xl">
                        {listing.cropEmoji}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display font-bold text-base text-foreground">
                        {listing.cropName}
                      </h3>
                      <Badge
                        className={`text-xs px-2 py-0.5 ${categoryColor[listing.category] ?? "bg-gray-100 text-gray-600"}`}
                        variant="outline"
                      >
                        {listing.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-sm font-display font-bold text-emerald-600">
                        ₹{listing.pricePerKg}/kg
                      </span>
                      <span className="text-xs text-muted-foreground font-body">
                        {listing.quantity.toLocaleString("en-IN")} kg{" "}
                        {t("available")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-body mt-1 line-clamp-1">
                      {listing.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={listing.available}
                      onCheckedChange={(v) =>
                        updateListing(listing.id, { available: v })
                      }
                    />
                    <span
                      className={`text-xs font-body font-semibold ${listing.available ? "text-emerald-600" : "text-muted-foreground"}`}
                    >
                      {listing.available ? t("available") : t("unavailable")}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-teal-600 hover:bg-teal-50 rounded-xl"
                      onClick={() => openEdit(listing)}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-red-500 hover:bg-red-50 rounded-xl"
                      onClick={() => handleDelete(listing.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md mx-4 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold flex items-center gap-2 text-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Sprout className="w-4 h-4 text-white" />
              </div>
              {editingId ? t("updateListing") : t("addCrop")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3 mt-2">
            {/* Crop Name Autocomplete */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">{t("cropName")} *</Label>
              <CropAutocomplete
                value={form.cropName}
                onChange={(crop) => {
                  setForm((p) => ({
                    ...p,
                    cropName: crop.name,
                    cropEmoji: crop.emoji,
                    category: crop.category as CropCategoryExtended,
                  }));
                }}
              />
              {form.cropName && (
                <div className="flex items-center gap-2 bg-emerald-50 rounded-xl px-3 py-1.5">
                  <span className="text-xl">{form.cropEmoji}</span>
                  <span className="text-xs font-bold text-emerald-700">
                    {form.cropName}
                  </span>
                  {form.category && (
                    <Badge
                      className={`ml-auto text-[10px] ${categoryColor[form.category] ?? ""}`}
                      variant="outline"
                    >
                      {form.category}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Photo Upload */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">{t("uploadPhoto")}</Label>
              {form.photoUrl ? (
                <div className="relative">
                  <img
                    src={form.photoUrl}
                    alt="crop"
                    className="w-full h-24 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, photoUrl: "" }))}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-emerald-300 rounded-xl cursor-pointer hover:bg-emerald-50/50 transition-colors">
                  <Upload className="w-5 h-5 text-emerald-500 mb-1" />
                  <span className="text-xs text-muted-foreground">
                    {t("uploadPhoto")}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) =>
                          setForm((p) => ({
                            ...p,
                            photoUrl: ev.target?.result as string,
                          }));
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              )}
            </div>

            {/* Category (auto-filled but editable) */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">{t("category")} *</Label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Vegetables",
                  "Fruits",
                  "Grains",
                  "Spices",
                  "Pulses",
                  "Cash Crops",
                  "Corn",
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        category: cat as CropCategoryExtended,
                      }))
                    }
                    className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                      form.category === cat
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{t("quantityKg")} *</Label>
                <Input
                  type="number"
                  placeholder="500"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, quantity: e.target.value }))
                  }
                  required
                  min="1"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">
                  {t("pricePerKg")} (₹) *
                </Label>
                <Input
                  type="number"
                  placeholder="35"
                  value={form.pricePerKg}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, pricePerKg: e.target.value }))
                  }
                  required
                  min="1"
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">{t("location")}</Label>
              <Input
                placeholder="e.g. Nashik, Maharashtra"
                value={form.location}
                onChange={(e) =>
                  setForm((p) => ({ ...p, location: e.target.value }))
                }
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">{t("description")}</Label>
              <Textarea
                placeholder="Apni fasal ke baare mein batayein..."
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                rows={2}
                className="resize-none rounded-xl"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setModalOpen(false)}
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl"
              >
                {editingId ? t("updateListing") : t("addCrop")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
