type GameReviewBoxProps = {
  review: string;
  onReviewChange: (review: string) => void;
  onSubmit: () => void;
};

export function GameReviewBox({
  review,
  onReviewChange,
  onSubmit,
}: GameReviewBoxProps) {
  return (
    <div className="review-box">
      <h2 className="review-heading">Write a Review</h2>

      <textarea
        value={review}
        onChange={(event) => onReviewChange(event.target.value)}
        placeholder="What did you think about this game?"
        className="review-textarea"
      />

      <button
        onClick={onSubmit}
        className="review-button"
        disabled={!review.trim()}
      >
        Post Review
      </button>
    </div>
  );
}
