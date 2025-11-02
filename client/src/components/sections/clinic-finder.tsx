import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ClinicCard from "@/components/ui/clinic-card";
import type { Clinic } from "@shared/schema";
import { useDebounce } from "@/hooks/use-debounce";
import { supabase } from "@/lib/supabase";

export default function ClinicFinder() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // Debounce input by 500ms

  const { data: clinics = [], isLoading } = useQuery({
    queryKey: ["clinics", debouncedSearchQuery],
    queryFn: async () => {
      let query = supabase
        .from('clinics')
        .select(`
          *,
          doctors (
            id,
            name,
            bio,
            experience,
            rating,
            is_active
          )
        `)
        .eq('is_active', true);

      if (debouncedSearchQuery) {
        query = query.or(`name.ilike.%${debouncedSearchQuery}%,address.ilike.%${debouncedSearchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleSearch = () => {
    // Search is already handled by the query dependency on searchQuery
  };

  return (
    <section id="patients" className="py-20 bg-gradient-to-br from-gray-50 via-primary/5 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h3 className="text-responsive-lg font-bold text-gray-900 mb-6">Find Clinics Near You</h3>
            <p className="text-responsive text-gray-600 mb-8">Real-time availability and wait times at your fingertips</p>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden hover-lift animate-slide-up">
            <div className="p-6 border-b border-gray-200/50">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Enter your location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border-2 focus:border-primary transition-colors"
                    data-testid="input-location-search"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg text-white btn-modern"
                  data-testid="button-search-clinics"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Mock Map Interface */}
            <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600"
                alt="City map view with healthcare facility markers"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />

              {/* Clinic Cards Overlay */}
              <div className="absolute top-4 right-4 w-80 space-y-3 max-h-80 overflow-y-auto animate-slide-up">
                {isLoading ? (
                  [...Array(2)].map((_, i) => (
                    <div key={i} className="glass-card rounded-lg p-4 skeleton">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
                      <div className="flex justify-between">
                        <div className="h-6 bg-gray-300 rounded w-16"></div>
                        <div className="h-8 bg-gray-300 rounded w-20"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  clinics.slice(0, 3).map((clinic: Clinic) => (
                    <ClinicCard key={clinic.id} clinic={clinic} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
