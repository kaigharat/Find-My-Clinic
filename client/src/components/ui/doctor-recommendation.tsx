import { useState } from "react";
import { Star, MapPin, Clock, Phone, User, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Doctor, Clinic } from "@shared/schema";

interface DoctorRecommendationProps {
  doctor: Doctor;
  clinic: Clinic;
  confidence: number;
  analysisResult: string;
  urgency: string;
  onBookAppointment: (doctorId: string) => void;
}

export default function DoctorRecommendation({
  doctor,
  clinic,
  confidence,
  analysisResult,
  urgency,
  onBookAppointment,
}: DoctorRecommendationProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "emergency": return "bg-red-500 text-white";
      case "urgent": return "bg-orange-500 text-white";
      case "routine": return "bg-blue-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow animate-fade-in">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{doctor.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < (doctor.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-sm text-gray-600">({doctor.rating || 0})</span>
                </div>
                <Badge className={getUrgencyColor(urgency)}>
                  {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-medium ${getConfidenceColor(confidence)}`}>
              {confidence}% Match
            </div>
            <div className="text-xs text-gray-500">Confidence</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Analysis Result */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800 font-medium">{analysisResult}</p>
        </div>

        {/* Clinic Info */}
        <div className="flex items-start space-x-2">
          <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">{clinic.name}</p>
            <p className="text-sm text-gray-600">{clinic.address}</p>
          </div>
        </div>

        {/* Experience */}
        {doctor.experience && (
          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {doctor.experience} years experience
            </span>
          </div>
        )}

        {/* Bio */}
        {doctor.bio && (
          <p className="text-sm text-gray-600 line-clamp-2">{doctor.bio}</p>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{doctor.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Clinic Information</h4>
                  <p className="text-sm text-gray-600">{clinic.name}</p>
                  <p className="text-sm text-gray-600">{clinic.address}</p>
                  <p className="text-sm text-gray-600">{clinic.phone}</p>
                </div>

                {doctor.bio && (
                  <div>
                    <h4 className="font-medium mb-2">About</h4>
                    <p className="text-sm text-gray-600">{doctor.bio}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Experience</h4>
                    <p className="text-sm text-gray-600">{doctor.experience || 0} years</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Rating</h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < (doctor.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-1">Recommendation</h4>
                  <p className="text-sm text-yellow-700">{analysisResult}</p>
                  <p className="text-xs text-yellow-600 mt-1">
                    Confidence: {confidence}%
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            onClick={() => onBookAppointment(doctor.id)}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            Book Appointment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
