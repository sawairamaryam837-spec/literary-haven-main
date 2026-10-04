import { Star } from "lucide-react";

export function RatingStars({ rating, count }: { rating: number; count?: number }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-1.5" aria-label={`${rating} out of 5 stars`}>
      <div className="flex text-gold" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <Star key={index} className={`size-3.5 ${index < rounded ? "fill-current" : "opacity-30"}`} />
        ))}
      </div>
      <span className="text-xs font-semibold text-foreground">{Number(rating).toFixed(1)}</span>
      {count != null && <span className="text-xs text-muted-foreground">({count})</span>}
    </div>
  );
}