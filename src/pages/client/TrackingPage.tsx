import React, { useState } from 'react';
import ClientLayout from '../../layouts/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/client/Card';
import { Input } from '../../components/client/Input';
import { Button } from '../../components/client/Button';
import { Separator } from '../../components/client/Separator';
import { Search, MapPin, Package, Truck, CheckCircle } from 'lucide-react';

const TrackingPage = () => {
  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // This would be an API call in a real application
      if (trackingId === 'TF-10046') {
        setTrackingResult({
          id: 'TF-10046',
          status: 'In Transit',
          sender: 'TechStart Inc',
          recipient: 'Sarah Johnson',
          origin: 'San Francisco, CA',
          destination: 'New York, NY',
          estimatedDelivery: 'April 20, 2025',
          lastUpdated: 'April 17, 2025, 9:45 AM',
          trackingHistory: [
            { 
              status: 'Package picked up', 
              location: 'San Francisco, CA', 
              timestamp: 'April 15, 2025, 10:30 AM',
              completed: true 
            },
            { 
              status: 'Package departed', 
              location: 'San Francisco Sorting Center', 
              timestamp: 'April 15, 2025, 6:15 PM',
              completed: true
            },
            { 
              status: 'Package arrived at facility', 
              location: 'Chicago Distribution Center', 
              timestamp: 'April 16, 2025, 8:20 AM',
              completed: true 
            },
            { 
              status: 'Package in transit', 
              location: 'En route to New York', 
              timestamp: 'April 17, 2025, 9:45 AM',
              completed: true 
            },
            { 
              status: 'Out for delivery', 
              location: 'New York, NY', 
              timestamp: 'Pending',
              completed: false 
            },
            { 
              status: 'Delivered', 
              location: 'New York, NY', 
              timestamp: 'Pending',
              completed: false 
            }
          ]
        });
      } else {
        setError('No courier found with the provided tracking ID. Try using TF-10046 for a demo.');
        setTrackingResult(null);
      }
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Track Your Courier</h1>
          <p className="text-muted-foreground">
            Enter your tracking ID to get real-time updates on your delivery
          </p>
        </div>
        
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleTrack} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Enter tracking ID (e.g., TF-10046)" 
                  className="pl-10" 
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Tracking...' : 'Track'}
              </Button>
            </form>
            
            {error && (
              <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
        
        {trackingResult && (
          <div className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Tracking Details: {trackingResult.id}</CardTitle>
                    <CardDescription>Last updated: {trackingResult.lastUpdated}</CardDescription>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium text-sm">
                    {trackingResult.status}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">From</h3>
                    <p className="font-medium">{trackingResult.sender}</p>
                    <p>{trackingResult.origin}</p>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="hidden md:block w-full h-2 relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-dashed border-gray-300"></div>
                      </div>
                      <div className="absolute inset-0 flex justify-between items-center">
                        <div className="bg-green-500 rounded-full h-4 w-4"></div>
                        <Truck className="text-blue-500 h-6 w-6" />
                        <div className="bg-gray-300 rounded-full h-4 w-4"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">To</h3>
                    <p className="font-medium">{trackingResult.recipient}</p>
                    <p>{trackingResult.destination}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">Estimated Delivery</h3>
                    <span>{trackingResult.estimatedDelivery}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tracking History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trackingResult.trackingHistory.map((event: any, index: number) => (
                    <div key={index} className="relative">
                      {index < trackingResult.trackingHistory.length - 1 && (
                        <div 
                          className={`absolute left-3.5 top-6 w-0.5 h-full ${event.completed ? 'bg-primary' : 'bg-gray-200'}`}
                        ></div>
                      )}
                      
                      <div className="flex gap-4">
                        <div className={`mt-1 rounded-full p-1.5 ${event.completed ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                          {event.status.includes('picked') && <Package className="h-4 w-4" />}
                          {event.status.includes('transit') && <Truck className="h-4 w-4" />}
                          {event.status.includes('facility') && <MapPin className="h-4 w-4" />}
                          {event.status.includes('Delivered') && <CheckCircle className="h-4 w-4" />}
                          {!event.status.includes('picked') && !event.status.includes('transit') && 
                           !event.status.includes('facility') && !event.status.includes('Delivered') && 
                           <Package className="h-4 w-4" />}
                        </div>
                        
                        <div className="flex-1">
                          <p className={`font-medium ${!event.completed && 'text-muted-foreground'}`}>
                            {event.status}
                          </p>
                          <div className="flex justify-between mt-1 text-sm">
                            <span className="text-muted-foreground">{event.location}</span>
                            <span className={`${!event.completed && 'text-muted-foreground'}`}>
                              {event.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default TrackingPage;
