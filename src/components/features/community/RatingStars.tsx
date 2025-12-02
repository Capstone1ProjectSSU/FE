import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
interface RatingStarsProps {
  value?: number; // ✅ optional
  onRate: (rating: number) => void;
}

export default function RatingStars({ value = 0, onRate }: RatingStarsProps) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="flex space-x-1 mb-3">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onRate(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(null)}
          className="focus:outline-none"
        >
          <FontAwesomeIcon
            icon={faStar}
            className={`w-5 h-5 transition-colors duration-150 ${
              (hover ?? value) >= n ? "text-yellow-400" : "text-gray-500"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
