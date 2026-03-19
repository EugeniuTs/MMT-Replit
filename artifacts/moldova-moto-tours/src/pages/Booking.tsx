import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useListTours, useListTourDates, useListMotorcycles, useCreateBooking, useCreatePaymentIntent, useConfirmPayment } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Check, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
// Fake stripe components since we don't have the key guaranteed to be valid
// In a real app we'd use Elements and PaymentElement from @stripe/react-stripe-js

const bookingSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(5, "Phone is required"),
  country: z.string().min(2, "Country is required"),
  ridingExperience: z.string().min(1, "Please select experience level"),
  hasLicense: z.boolean().refine(val => val === true, "You must have a valid license"),
  paymentType: z.enum(["deposit", "full"]),
});

export default function BookingWizard() {
  const [step, setStep] = useState(1);
  const [selectedTourId, setSelectedTourId] = useState<number | null>(null);
  const [selectedDateId, setSelectedDateId] = useState<number | null>(null);
  const [selectedMotorcycleId, setSelectedMotorcycleId] = useState<number | null>(null);
  const [bookingId, setBookingId] = useState<number | null>(null);
  
  const { toast } = useToast();

  const { data: tours, isLoading: loadingTours } = useListTours();
  const { data: dates, isLoading: loadingDates } = useListTourDates(selectedTourId ? { tourId: selectedTourId } : undefined);
  const { data: motorcycles } = useListMotorcycles();
  
  const createBooking = useCreateBooking();
  // We'll mock the actual payment flow for the UI demo

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      hasLicense: false,
      paymentType: "deposit"
    }
  });

  const selectedTour = tours?.find(t => t.id === selectedTourId);
  const depositAmount = selectedTour ? selectedTour.priceEur * 0.2 : 0;

  const handleNext = () => {
    if (step === 1 && !selectedTourId) {
      toast({ title: "Please select a tour", variant: "destructive" });
      return;
    }
    if (step === 2 && !selectedDateId) {
      toast({ title: "Please select a date", variant: "destructive" });
      return;
    }
    setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => s - 1);

  const onSubmitInfo = (values: z.infer<typeof bookingSchema>) => {
    if (!selectedTourId || !selectedDateId) return;
    
    createBooking.mutate({
      data: {
        tourId: selectedTourId,
        tourDateId: selectedDateId,
        motorcycleId: selectedMotorcycleId,
        ...values
      }
    }, {
      onSuccess: (data) => {
        setBookingId(data.id);
        setStep(5); // Proceed to payment
      },
      onError: () => {
        toast({ title: "Booking failed", description: "Please try again", variant: "destructive" });
      }
    });
  };

  const handleMockPayment = () => {
    toast({ title: "Payment Successful", description: "Your booking is confirmed!" });
    setStep(6);
  };

  return (
    <div className="pt-24 min-h-screen bg-background pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                step >= i ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
              }`}>
                {step > i ? <Check className="w-4 h-4" /> : i}
              </div>
            ))}
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((step - 1) / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="bg-card border-border shadow-xl">
          <CardContent className="p-6 md:p-10">
            
            {/* Step 1: Select Tour */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-3xl font-display mb-6 text-foreground">Select Your Expedition</h2>
                {loadingTours ? <div className="text-center p-8">Loading tours...</div> : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tours?.filter(t=>t.isActive).map(tour => (
                      <div 
                        key={tour.id}
                        onClick={() => setSelectedTourId(tour.id)}
                        className={`cursor-pointer rounded-xl border-2 transition-all p-4 ${
                          selectedTourId === tour.id 
                            ? 'border-primary bg-primary/10' 
                            : 'border-border/50 bg-background hover:border-primary/50'
                        }`}
                      >
                        <h3 className="font-bold text-lg mb-1">{tour.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{tour.durationDays} Days • €{tour.priceEur}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{tour.shortDescription}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-8 flex justify-end">
                  <Button onClick={handleNext} size="lg" className="font-display tracking-wider">Next Step <ChevronRight className="w-4 h-4 ml-2" /></Button>
                </div>
              </div>
            )}

            {/* Step 2: Select Date */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-3xl font-display mb-2 text-foreground">Choose a Date</h2>
                <p className="text-muted-foreground mb-6">Available dates for {selectedTour?.name}</p>
                
                {loadingDates ? <div className="text-center p-8">Loading dates...</div> : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {dates?.length === 0 && <p className="col-span-2 text-center py-8 text-muted-foreground">No available dates currently scheduled for this tour.</p>}
                    {dates?.filter(d=>d.isActive).map(date => (
                      <div 
                        key={date.id}
                        onClick={() => setSelectedDateId(date.id)}
                        className={`cursor-pointer rounded-xl border-2 transition-all p-4 flex items-center gap-4 ${
                          selectedDateId === date.id 
                            ? 'border-primary bg-primary/10' 
                            : 'border-border/50 bg-background hover:border-primary/50'
                        }`}
                      >
                        <div className="bg-secondary p-3 rounded-lg">
                          <CalendarIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-bold text-foreground">
                            {format(new Date(date.startDate), 'MMM dd')} - {format(new Date(date.endDate), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {date.availableSpots} spots remaining
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-8 flex justify-between">
                  <Button onClick={handleBack} variant="outline" size="lg"><ChevronLeft className="w-4 h-4 mr-2" /> Back</Button>
                  <Button onClick={handleNext} size="lg" className="font-display tracking-wider">Next Step <ChevronRight className="w-4 h-4 ml-2" /></Button>
                </div>
              </div>
            )}

            {/* Step 3: Select Motorcycle */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-3xl font-display mb-2 text-foreground">Need a Bike?</h2>
                <p className="text-muted-foreground mb-6">Select a motorcycle from our fleet, or choose 'Bring my own'.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div 
                    onClick={() => setSelectedMotorcycleId(null)}
                    className={`cursor-pointer rounded-xl border-2 transition-all p-6 text-center flex flex-col items-center justify-center ${
                      selectedMotorcycleId === null 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border/50 bg-background hover:border-primary/50'
                    }`}
                  >
                    <h3 className="font-bold text-lg">Bring My Own Bike</h3>
                    <p className="text-sm text-muted-foreground">I will ride my own motorcycle.</p>
                  </div>
                  
                  {motorcycles?.filter(m=>m.isAvailable).map(bike => (
                    <div 
                      key={bike.id}
                      onClick={() => setSelectedMotorcycleId(bike.id)}
                      className={`cursor-pointer rounded-xl border-2 transition-all p-4 flex flex-col items-center text-center ${
                        selectedMotorcycleId === bike.id 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border/50 bg-background hover:border-primary/50'
                      }`}
                    >
                      <img src={bike.imageUrl || "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=200&q=80"} alt={bike.model} className="h-20 object-contain mb-2 mix-blend-screen" />
                      <h3 className="font-bold">{bike.brand} {bike.model}</h3>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 flex justify-between">
                  <Button onClick={handleBack} variant="outline" size="lg"><ChevronLeft className="w-4 h-4 mr-2" /> Back</Button>
                  <Button onClick={handleNext} size="lg" className="font-display tracking-wider">Next Step <ChevronRight className="w-4 h-4 ml-2" /></Button>
                </div>
              </div>
            )}

            {/* Step 4: Rider Info */}
            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-3xl font-display mb-6 text-foreground">Rider Information</h2>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmitInfo)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="fullName" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input className="bg-background" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" className="bg-background" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem><FormLabel>Phone</FormLabel><FormControl><Input className="bg-background" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="country" render={({ field }) => (
                        <FormItem><FormLabel>Country</FormLabel><FormControl><Input className="bg-background" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      
                      <FormField control={form.control} name="ridingExperience" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Riding Experience</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background"><SelectValue placeholder="Select experience" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner (1-2 years)</SelectItem>
                              <SelectItem value="intermediate">Intermediate (3-5 years)</SelectItem>
                              <SelectItem value="advanced">Advanced (5+ years)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      
                      <FormField control={form.control} name="paymentType" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Option</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="deposit">Pay 20% Deposit (€{depositAmount})</SelectItem>
                              <SelectItem value="full">Pay Full Amount (€{selectedTour?.priceEur})</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="hasLicense" render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-4 bg-background">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>I hold a valid motorcycle license ("A" Category)</FormLabel>
                        </div>
                      </FormItem>
                    )} />
                    
                    <div className="mt-8 flex justify-between">
                      <Button type="button" onClick={handleBack} variant="outline" size="lg"><ChevronLeft className="w-4 h-4 mr-2" /> Back</Button>
                      <Button type="submit" size="lg" disabled={createBooking.isPending} className="font-display tracking-wider">
                        {createBooking.isPending ? "Processing..." : "Proceed to Payment"} <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            )}

            {/* Step 5: Payment */}
            {step === 5 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 text-center">
                <h2 className="text-3xl font-display mb-4 text-foreground">Secure Payment</h2>
                <div className="bg-background border border-border rounded-xl p-6 mb-8 inline-block mx-auto text-left min-w-[300px]">
                  <p className="text-muted-foreground mb-1">Total Amount: <span className="text-foreground float-right">€{selectedTour?.priceEur}</span></p>
                  <p className="text-xl font-bold text-primary border-t border-border mt-2 pt-2">
                    To Pay Now: <span className="float-right">€{form.getValues().paymentType === 'deposit' ? depositAmount : selectedTour?.priceEur}</span>
                  </p>
                </div>
                
                <div className="bg-secondary/50 p-8 rounded-xl border border-border mb-8 max-w-md mx-auto">
                  <p className="text-muted-foreground mb-6">Payment element mock (Stripe integration would render here).</p>
                  <Button onClick={handleMockPayment} size="lg" className="w-full font-display tracking-wider uppercase">
                    Confirm & Pay
                  </Button>
                </div>
              </div>
            )}

            {/* Step 6: Success */}
            {step === 6 && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 text-center py-12">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-4xl font-display mb-4 text-foreground">Booking Confirmed!</h2>
                <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
                  Your spot is secured. We've sent a confirmation email with all the details you need to prepare for the adventure.
                </p>
                <Button onClick={() => window.location.href = '/'} size="lg" variant="outline">
                  Return Home
                </Button>
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
