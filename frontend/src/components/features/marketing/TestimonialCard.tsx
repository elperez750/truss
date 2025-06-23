import { Star } from "lucide-react"

interface TestimonialCardProps {
  name: string
  location: string
  rating: number
  review: string
  avatar: string
  projectType?: string
  isActive?: boolean
  animationDelay?: number
}

const TestimonialCard = ({
  name,
  location,
  rating,
  review,
  avatar,
  projectType,
  isActive,
  animationDelay = 0,
}: TestimonialCardProps) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-4 ${isActive ? "ring-2 ring-blue-500" : ""}`}
      style={{
        animationDelay: `${animationDelay}s`,
        animationDuration: "3s",
      }}
    >
      <div className="flex items-start space-x-4">
        <img src={avatar || "/placeholder.svg"} alt={name} className="w-12 h-12 rounded-full flex-shrink-0" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap mb-2">
            <h4 className="font-bold text-lg text-gray-900 mr-3">{name}</h4>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
              ))}
            </div>
          </div>

          <p className="text-base text-gray-700">"{review}"</p>

          {projectType && (
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{projectType}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TestimonialCard