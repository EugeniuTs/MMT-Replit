import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { useSubmitContact } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  subject: z.string().min(5, "Subject is required."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export default function Contact() {
  const { toast } = useToast();
  const mutation = useSubmitContact();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast({
            title: "Message Sent!",
            description: "We'll get back to you as soon as possible.",
          });
          form.reset();
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to send message. Please try again.",
          });
        }
      }
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-background pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-display mb-4">Get In Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about a tour? Need a custom itinerary? Drop us a line.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-8">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h3 className="font-display text-xl mb-6 text-primary border-b border-border pb-4">Contact Info</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-secondary p-3 rounded-full">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider mb-1">Phone / WhatsApp</p>
                      <p className="text-foreground font-medium">+373 60 123 456</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-secondary p-3 rounded-full">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider mb-1">Email</p>
                      <p className="text-foreground font-medium">info@moldovamototours.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-secondary p-3 rounded-full">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider mb-1">Location</p>
                      <p className="text-foreground font-medium">Chisinau, Republic of Moldova</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-8 bg-[#25D366] hover:bg-[#128C7E] text-white" size="lg">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat on WhatsApp
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-muted-foreground">Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" className="bg-background" {...field} />
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
                            <FormLabel className="text-muted-foreground">Email</FormLabel>
                            <FormControl>
                              <Input placeholder="john@example.com" className="bg-background" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground">Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Question about 5-Day Tour" className="bg-background" {...field} />
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
                          <FormLabel className="text-muted-foreground">Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="How can we help you?" 
                              className="bg-background min-h-[150px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" size="lg" className="font-display tracking-wider uppercase px-10" disabled={mutation.isPending}>
                      {mutation.isPending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
