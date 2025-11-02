import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Ticket, Clock, MapPin, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface QueueToken {
  id: string;
  token_number: number;
  status: string;
  estimated_wait_time: number | null;
  created_at: string;
  clinic: {
    name: string;
    address: string;
    phone: string;
  };
  doctor: {
    name: string;
    specialization: string;
  };
}

export default function QueueStatus() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [tokenNumber, setTokenNumber] = useState("");
  const [queueToken, setQueueToken] = useState<QueueToken | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!tokenNumber.trim()) {
      toast({
        title: "Token Required",
        description: "Please enter your token number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('queue_tokens')
        .select(`
          id,
          token_number,
          status,
          estimated_wait_time,
          created_at,
          clinic:clinics (
            name,
            address,
            phone
          ),
          patient:patients (
            id
          ),
          doctor:doctors (
            name,
            specialization
          )
        `)
        .eq('token_number', parseInt(tokenNumber))
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found
          setQueueToken(null);
        } else {
          throw error;
        }
      } else {
        setQueueToken(data);
      }

      setSearched(true);
    } catch (error) {
      console.error('Error searching token:', error);
      toast({
        title: "Search Failed",
        description: "Unable to find token. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-500 text-white';
      case 'called': return 'bg-blue-500 text-white';
      case 'completed': return 'bg-green-500 text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Check Queue Status
            </h1>
            <p className="text-gray-600">
              Enter your token number to check your position in the queue
            </p>
          </div>
        </div>

        {/* Search Form */}
        <Card className="max-w-2xl mx-auto mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Your Token
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="token">Token Number</Label>
                <Input
                  id="token"
                  type="number"
                  placeholder="Enter your token number (e.g., 123)"
                  value={tokenNumber}
                  onChange={(e) => setTokenNumber(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Searching..." : "Check Status"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {searched && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Token Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {queueToken ? (
                <div className="space-y-6">
                  {/* Token Info */}
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Ticket className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-900">
                          Token #{queueToken.token_number}
                        </h3>
                        <p className="text-sm text-blue-700">
                          Issued on {new Date(queueToken.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(queueToken.status)}>
                      {queueToken.status.charAt(0).toUpperCase() + queueToken.status.slice(1)}
                    </Badge>
                  </div>

                  {/* Clinic Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Clinic</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{queueToken.clinic.name}</p>
                        <p className="text-sm text-gray-600">{queueToken.clinic.address}</p>
                        <p className="text-sm text-gray-600">{queueToken.clinic.phone}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Doctor</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{queueToken.doctor.name}</p>
                        <p className="text-sm text-gray-600">{queueToken.doctor.specialization}</p>
                      </div>
                    </div>
                  </div>

                  {/* Wait Time */}
                  {queueToken.status === 'waiting' && queueToken.estimated_wait_time && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-800 mb-2">
                        <Clock className="h-5 w-5" />
                        <span className="font-medium">Estimated Wait Time</span>
                      </div>
                      <p className="text-yellow-700">
                        Approximately {queueToken.estimated_wait_time} minutes
                      </p>
                      <p className="text-sm text-yellow-600 mt-1">
                        Please arrive at the clinic on time. You will be called when it's your turn.
                      </p>
                    </div>
                  )}

                  {/* Status Messages */}
                  {queueToken.status === 'called' && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800 mb-2">
                        <Clock className="h-5 w-5" />
                        <span className="font-medium">Your Turn!</span>
                      </div>
                      <p className="text-green-700">
                        Please proceed to the clinic immediately. The doctor is ready to see you.
                      </p>
                    </div>
                  )}

                  {queueToken.status === 'completed' && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800 mb-2">
                        <Clock className="h-5 w-5" />
                        <span className="font-medium">Visit Completed</span>
                      </div>
                      <p className="text-green-700">
                        Thank you for visiting. We hope to see you again!
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Ticket className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Token Not Found
                  </h3>
                  <p className="text-gray-600">
                    We couldn't find a token with that number. Please check your token number and try again.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    If you just booked, please wait a few minutes and try again.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}