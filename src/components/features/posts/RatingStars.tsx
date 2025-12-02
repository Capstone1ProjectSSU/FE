import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
interface RatingStarsProps {
  value: number;
}

export default function RatingStars({ value = 0 }: RatingStarsProps) {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <FontAwesomeIcon
          key={n}
          icon={faStar}
          className={`w-5 h-5 transition-colors duration-150 ${(value) >= n ? "text-yellow-400" : "text-gray-500"
            }`}
        />
      ))}
    </div>
  );
}
