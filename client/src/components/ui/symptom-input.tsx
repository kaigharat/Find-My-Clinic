import { useState, useRef } from "react";
import { Camera, Upload, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SymptomInputProps {
  onSubmit: (data: {
    description: string;
    severity: string;
    duration: string;
    image?: File;
    additionalNotes?: string;
  }) => void;
  isLoading?: boolean;
}

export default function SymptomInput({ onSubmit, isLoading = false }: SymptomInputProps) {
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("");
  const [duration, setDuration] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !severity) {
      return;
    }

    onSubmit({
      description: description.trim(),
      severity,
      duration: duration || undefined,
      image: image || undefined,
      additionalNotes: additionalNotes.trim() || undefined,
    });
  };

  const isFormValid = description.trim() && severity;

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Describe Your Symptoms
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Symptom Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">
              What symptoms are you experiencing? *
            </Label>
            <Textarea
              id="description"
              placeholder="Please describe your symptoms in detail (e.g., headache, fever, cough, pain location, etc.)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] resize-none"
              required
            />
          </div>

          {/* Severity Level */}
          <div className="space-y-2">
            <Label htmlFor="severity" className="text-base font-medium">
              How severe are your symptoms? *
            </Label>
            <Select value={severity} onValueChange={setSeverity} required>
              <SelectTrigger>
                <SelectValue placeholder="Select severity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mild">Mild - Symptoms are noticeable but not interfering with daily activities</SelectItem>
                <SelectItem value="moderate">Moderate - Symptoms are interfering with some daily activities</SelectItem>
                <SelectItem value="severe">Severe - Symptoms are significantly impacting daily life or require immediate attention</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-base font-medium">
              How long have you had these symptoms?
            </Label>
            <Input
              id="duration"
              placeholder="e.g., 2 days, 1 week, 3 months"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-base font-medium">
              Upload an image (optional)
            </Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Image
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                Take Photo
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageCapture}
              className="hidden"
            />

            {imagePreview && (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Symptom preview"
                  className="max-w-full h-32 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-base font-medium">
              Additional notes (optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Any other relevant information (medications, allergies, recent events, etc.)"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? "Analyzing..." : "Analyze Symptoms"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
