import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
}

export function StarRating({
  rating,
  reviewCount,
  size = "sm",
}: StarRatingProps) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${iconSize} ${
              star <= Math.floor(rating)
                ? "fill-amber-400 text-amber-400"
                : star <= rating
                  ? "fill-amber-400/50 text-amber-400"
                  : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-foreground">
        {rating.toFixed(1)}
      </span>
      {reviewCount !== undefined && (
        <span className="text-xs text-muted-foreground">({reviewCount})</span>
      )}
    </div>
  );
}
