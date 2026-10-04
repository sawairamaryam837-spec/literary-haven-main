import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function WishlistButton({ title, className }: { title: string; className?: string }) {
  const [saved, setSaved] = useState(false);
  return (
    <Button
      type="button"
      size="icon"
      variant="secondary"
      aria-label={saved ? `Remove ${title} from wishlist` : `Save ${title} to wishlist`}
      aria-pressed={saved}
      className={cn("size-9 rounded-full shadow-card", className)}
      onClick={(event) => {
        event.preventDefault();
        setSaved((value) => !value);
        toast(saved ? "Removed from your wishlist" : "Saved to your wishlist");
      }}
    >
      <Heart className={cn("transition-transform", saved && "scale-110 fill-crimson text-crimson")} />
    </Button>
  );
}