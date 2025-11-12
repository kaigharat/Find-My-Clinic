import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Camera, Upload, X, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface SymptomInputProps {
  onSubmit: (data: {
    description: string;
    severity: string;
    duration?: string;
    age?: string;
    gender?: string;
    location?: string;
    image?: File;
    additionalNotes?: string;
  }) => void;
  isLoading?: boolean;
}

export default function SymptomInput({ onSubmit, isLoading = false }: SymptomInputProps) {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const form = useForm({
    defaultValues: {
      description: "",
      severity: "",
      duration: "",
      age: "",
      gender: "",
      location: "",
      additionalNotes: "",
    },
  });

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

  const handleSubmit = (data: any) => {
    onSubmit({
      description: data.description,
      severity: data.severity,
      duration: data.duration || undefined,
      age: data.age || undefined,
      gender: data.gender || undefined,
      location: data.location || undefined,
      image: image || undefined,
      additionalNotes: data.additionalNotes || undefined,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {t('symptomAnalysis.input.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Age */}
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('symptomAnalysis.input.age')}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={t('symptomAnalysis.input.agePlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('symptomAnalysis.input.gender')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('symptomAnalysis.input.genderPlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">{t('symptomAnalysis.input.genderMale')}</SelectItem>
                      <SelectItem value="female">{t('symptomAnalysis.input.genderFemale')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('symptomAnalysis.input.location')}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={t('symptomAnalysis.input.locationPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Symptom Description */}
            <FormField
              control={form.control}
              name="description"
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('symptomAnalysis.input.descriptionLabel')} *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('symptomAnalysis.input.descriptionPlaceholder')}
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Severity Level */}
            <FormField
              control={form.control}
              name="severity"
              rules={{ required: "Severity is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('symptomAnalysis.input.severityLabel')} *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('symptomAnalysis.input.severityPlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mild">{t('symptomAnalysis.input.severityMild')}</SelectItem>
                      <SelectItem value="moderate">{t('symptomAnalysis.input.severityModerate')}</SelectItem>
                      <SelectItem value="severe">{t('symptomAnalysis.input.severitySevere')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('symptomAnalysis.input.durationLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('symptomAnalysis.input.durationPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <div className="space-y-2">
              <FormLabel>{t('symptomAnalysis.input.uploadImageLabel')}</FormLabel>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {t('symptomAnalysis.input.uploadImage')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" />
                  {t('symptomAnalysis.input.takePhoto')}
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageCapture}
                className="hidden"
                aria-label="Upload symptom image"
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
            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('symptomAnalysis.input.additionalNotesLabel')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('symptomAnalysis.input.additionalNotesPlaceholder')}
                      className="min-h-[80px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? t('symptomAnalysis.input.analyzing') : t('symptomAnalysis.input.analyze')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
