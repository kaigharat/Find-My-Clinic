import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Hospital, Users, TrendingUp, MessageSquare, Play, CheckCircle, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactRequestSchema } from "@shared/schema";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import CL from "@/images/CL.jpg";

const clinicContactSchema = insertContactRequestSchema.extend({
  type: z.literal("clinic_demo"),
  clinicName: z.string().min(1, "Clinic name is required"),
});

export default function Clinics() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Check URL parameters for booking flow
  const urlParams = new URLSearchParams(window.location.search);
  const doctorId = urlParams.get('doctor');
  const shouldBook = urlParams.get('book') === 'true';

  // Get doctor details if booking
  const { data: bookingDoctor } = useQuery({
    queryKey: ["booking-doctor", doctorId],
    queryFn: async () => {
      if (!doctorId) return null;
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', doctorId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!doctorId,
  });

  const { data: bookingClinic } = useQuery({
    queryKey: ["booking-clinic", bookingDoctor?.clinic_id],
    queryFn: async () => {
      if (!bookingDoctor?.clinic_id) return null;
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('id', bookingDoctor.clinic_id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!bookingDoctor,
  });

  // Show booking dialog if coming from symptom analysis
  useEffect(() => {
    if (shouldBook && bookingDoctor && bookingClinic) {
      setIsBookingDialogOpen(true);
    }
  }, [shouldBook, bookingDoctor, bookingClinic]);

  const form = useForm<z.infer<typeof clinicContactSchema>>({
    resolver: zodResolver(clinicContactSchema),
    defaultValues: {
      type: "clinic_demo",
      name: "",
      email: "",
      phone: "",
      message: "",
      clinicName: "",
    },
  });

  const submitRequestMutation = useMutation({
    mutationFn: async (data: z.infer<typeof clinicContactSchema>) => {
      const { data: result, error } = await supabase
        .from('contact_requests')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Demo Request Submitted!",
        description: "We'll get back to you within 24 hours to schedule your personalized demo.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit demo request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: z.infer<typeof clinicContactSchema>) => {
    submitRequestMutation.mutate(data);
  };

  const handleBookAppointment = async (doctorId: string, clinicId: string) => {
    try {
      // First create an anonymous patient record
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .insert([{
          name: 'Anonymous Patient',
          phone: '0000000000', // Placeholder phone
          email: null,
        }])
        .select()
        .single();

      if (patientError) throw patientError;

      // Create a queue token for the patient
      const { data: token, error } = await supabase
        .from('queue_tokens')
        .insert([{
          clinic_id: clinicId,
          patient_id: patient.id,
          token_number: Math.floor(Math.random() * 1000) + 1, // Simple random token
          status: 'waiting',
          estimated_wait_time: 30, // Default 30 minutes
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Appointment Booked!",
        description: `Your token number is ${token.token_number}. Estimated wait time: ${token.estimated_wait_time} minutes. Check your dashboard for status updates.`,
      });

      // Store token in localStorage for dashboard access
      const userTokens = JSON.parse(localStorage.getItem('userTokens') || '[]');
      userTokens.push({
        tokenNumber: token.token_number,
        clinicId: clinicId,
        doctorId: doctorId,
        createdAt: token.created_at
      });
      localStorage.setItem('userTokens', JSON.stringify(userTokens));

      setIsBookingDialogOpen(false);
      // Clear URL parameters
      navigate('/clinics', { replace: true });
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: "Unable to book appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const benefits = [
    {
      icon: TrendingUp,
      title: "Efficient Digital Management",
      description: "Simple admin panel or WhatsApp bot integration for seamless queue management without complex training.",
      color: "bg-primary",
    },
    {
      icon: Users,
      title: "Reduced Staff Burnout",
      description: "Eliminate manual queue management stress and reduce administrative chaos with automated patient flow.",
      color: "bg-success",
    },
    {
      icon: MessageSquare,
      title: "Better Resource Allocation",
      description: "Optimize staff scheduling and improve operational efficiency with predictive patient flow data.",
      color: "bg-secondary",
    },
  ];

  const features = [
    {
      title: "WhatsApp Integration",
      description: "Manage queues directly through WhatsApp - no additional training required.",
      checked: true,
    },
    {
      title: "Real-time Updates",
      description: "Automatic patient notifications and wait time adjustments.",
      checked: true,
    },
    {
      title: "Analytics Dashboard",
      description: "Track patient flow patterns and optimize your clinic operations.",
      checked: true,
    },
    {
      title: "QR Code System",
      description: "Provide a public QR for discovery and scan patients' personal QR codes for secure, instant check-in.",
      checked: true,
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${CL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${CL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          filter: 'brightness(0) blur(2px)',
          zIndex: -1
        }}
      ></div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary/10 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Transform Your Clinic Operations
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Reduce administrative burden and improve patient satisfaction with our intelligent queue management system
              </p>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-accent hover:bg-blue-600 text-white" data-testid="button-request-demo">
                    <Play className="h-5 w-5 mr-2" />
                    Request a Demo
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Request a Personalized Demo</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} data-testid="input-contact-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="clinicName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Clinic Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your clinic name" {...field} data-testid="input-clinic-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your email" {...field} data-testid="input-contact-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your phone number" {...field} value={field.value || ""} data-testid="input-contact-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us about your clinic's needs..." 
                                {...field} 
                                value={field.value || ""}
                                data-testid="input-contact-message"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                          className="flex-1"
                          data-testid="button-cancel-demo"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 bg-primary hover:bg-primary/90"
                          disabled={form.formState.isSubmitting}
                          data-testid="button-submit-demo"
                        >
                          {form.formState.isSubmitting ? "Submitting..." : "Request Demo"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Benefits Grid */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="Modern clinic reception area with digital check-in system" 
                  className="rounded-xl shadow-lg w-full"
                />
              </div>
              
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <Card key={index} className="border border-gray-100 hover:shadow-md transition-shadow" data-testid={`benefit-card-${index}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`w-10 h-10 ${benefit.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <benefit.icon className="text-white h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                          <p className="text-gray-600">{benefit.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 ">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Everything You Need to Get Started</h2>
              <p className="text-xl text-gray-600">Our platform is designed for easy adoption with minimal training required</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4" data-testid={`feature-item-${index}`}>
                    <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Card className="p-8 bg-white shadow-lg">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Hospital className="text-white h-8 w-8" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Ready to Get Started?</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-6">
                    Join hundreds of clinics already using Find My Clinic to improve their patient experience and operational efficiency.
                  </p>
                  <div className="space-y-3">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-primary hover:bg-primary/90" data-testid="button-get-started">
                          Get Started Today
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                    <p className="text-sm text-gray-500">No setup fees • 30-day free trial • Cancel anytime</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Book Appointment
            </DialogTitle>
          </DialogHeader>
          {bookingDoctor && bookingClinic && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Appointment Details</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <p><strong>Doctor:</strong> {bookingDoctor.name}</p>
                  <p><strong>Specialty:</strong> {bookingDoctor.specialization}</p>
                  <p><strong>Clinic:</strong> {bookingClinic.name}</p>
                  <p><strong>Address:</strong> {bookingClinic.address}</p>
                  <p><strong>Phone:</strong> {bookingClinic.phone}</p>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-green-800 mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Estimated Wait Time</span>
                </div>
                <p className="text-green-700">Approximately 30 minutes</p>
                <p className="text-sm text-green-600 mt-1">
                  You'll receive a token number and SMS updates about your position in queue.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsBookingDialogOpen(false);
                    navigate('/clinics', { replace: true });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleBookAppointment(bookingDoctor.id, bookingClinic.id)}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Confirm Booking
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Lite Mode Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-success/10 to-secondary/10 rounded-2xl p-8 md:p-12">
              <div className="w-16 h-16 bg-success rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="text-white h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Lite Mode Available</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Don't have advanced tech infrastructure? No problem! Our WhatsApp and SMS integration
                makes our platform accessible to every healthcare provider.
              </p>
              <div className="bg-white rounded-lg p-6 inline-block">
                <p className="text-sm font-medium text-success">✓ No App Required</p>
                <p className="text-sm font-medium text-success">✓ Works with Basic Phones</p>
                <p className="text-sm font-medium text-success">✓ Instant Setup</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
