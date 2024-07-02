import React, { useState } from "react";
import {
  FaRegSadCry,
  FaRegFrownOpen,
  FaRegMeh,
  FaRegSmile,
  FaRegGrinHearts,
  FaStar,
} from "react-icons/fa";
import { Card, CardHeader, CardBody, Button } from "@nextui-org/react";
import axios from "axios";
import { Toaster, toast } from "sonner";

const CraftsmanReview = ({ postId }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const getDescription = (ratingValue) => {
    if (ratingValue <= 1) return "Very Dissatisfied";
    if (ratingValue === 2) return "Dissatisfied";
    if (ratingValue === 3) return "Neutral";
    if (ratingValue === 4) return "Satisfied";
    if (ratingValue === 5) return "Very Satisfied";
  };

  const getEmoji = (ratingValue) => {
    if (ratingValue <= 1) return <FaRegSadCry className="text-red-500" />;
    if (ratingValue === 2)
      return <FaRegFrownOpen className="text-orange-500" />;
    if (ratingValue === 3) return <FaRegMeh className="text-yellow-500" />;
    if (ratingValue === 4)
      return <FaRegSmile className="text-light-green-500" />;
    if (ratingValue === 5)
      return <FaRegGrinHearts className="text-green-500" />;
  };

  const submitReview = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("User not logged in.");
        return;
      }
      if (!reviewText || !rating) {
        toast.error("Please provide both a review and a rating.", {
          duration: 3000,
        });
        return;
      }

      const response = await axios.post(
        "http://localhost:8080/comment/",
        {
          post_id: postId,
          comment: reviewText,
          rating: rating,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      console.log("Review submitted successfully:", response.data);
      toast.success("Review submitted successfully!", {
        duration: 2000,
      });

      setRating(0);
      setReviewText("");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="mt-4 mb-4">
      <h2 className="text-2xl font-bold mb-2">Review this Craftsman</h2>
      <Card>
        <CardHeader></CardHeader>
        <CardBody>
          <div className="flex items-center space-x-2">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={`cursor-pointer ${
                  index < rating ? "text-yellow-500" : "text-gray-300"
                }`}
                onClick={() => setRating(index + 1)}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center">
            {getEmoji(rating)}
            <p className="ml-2">
              {rating > 0
                ? `Satisfaction: ${getDescription(rating)}`
                : "Select a rating"}
            </p>
          </div>
          <form onSubmit={(e) => e.preventDefault()}>
            <textarea
              className="mt-2 p-2 border border-gray-300 rounded w-full"
              placeholder="Describe your experience..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <Button type="button" className="mt-2" onClick={submitReview}>
              Submit Review
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
export default CraftsmanReview;
