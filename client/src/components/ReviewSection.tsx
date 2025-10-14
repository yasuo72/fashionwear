import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, Verified } from "lucide-react";
import { format } from "date-fns";
import { WriteReviewDialog } from "@/components/WriteReviewDialog";

interface Review {
  _id: string;
  userId: {
    firstName: string;
    lastName: string;
  };
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
}

interface ReviewSectionProps {
  productId: string;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  onReviewSubmit: () => void;
}

export function ReviewSection({
  productId,
  reviews,
  averageRating,
  totalReviews,
  onReviewSubmit
}: ReviewSectionProps) {
  const [filter, setFilter] = useState<number | null>(null);

  const filteredReviews = filter
    ? reviews.filter(r => r.rating === filter)
    : reviews;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: totalReviews > 0 ? (reviews.filter(r => r.rating === rating).length / totalReviews) * 100 : 0
  }));

  const handleHelpful = async (reviewId: string) => {
    try {
      await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        credentials: 'include'
      });
      onReviewSubmit(); // Refresh reviews
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="text-center md:text-left">
            <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= averageRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-muted-foreground">Based on {totalReviews} reviews</p>
            <WriteReviewDialog productId={productId} onSuccess={onReviewSubmit}>
              <Button className="mt-4">Write a Review</Button>
            </WriteReviewDialog>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <button
                key={rating}
                onClick={() => setFilter(filter === rating ? null : rating)}
                className="flex items-center gap-2 w-full hover:bg-accent p-2 rounded transition-colors"
              >
                <span className="text-sm font-medium w-12">{rating} star</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            Customer Reviews {filter && `(${filter} stars)`}
          </h3>
          {filter && (
            <Button variant="ghost" size="sm" onClick={() => setFilter(null)}>
              Clear Filter
            </Button>
          )}
        </div>

        {filteredReviews.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              {filter
                ? `No ${filter}-star reviews yet`
                : "No reviews yet. Be the first to review this product!"}
            </p>
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review._id} className="p-6">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarFallback>
                    {review.userId.firstName[0]}{review.userId.lastName[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {review.userId.firstName} {review.userId.lastName}
                        </span>
                        {review.isVerified && (
                          <Badge variant="secondary" className="gap-1">
                            <Verified className="h-3 w-3" />
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(review.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  {review.title && (
                    <h4 className="font-semibold">{review.title}</h4>
                  )}

                  {/* Comment */}
                  <p className="text-muted-foreground">{review.comment}</p>

                  {/* Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => window.open(image, '_blank')}
                        />
                      ))}
                    </div>
                  )}

                  {/* Helpful Button */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHelpful(review._id)}
                      className="gap-2"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Helpful ({review.helpfulCount})
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
