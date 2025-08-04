import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Users, 
  Clock, 
  Calendar as CalendarIcon,
  CheckCircle, 
  Phone,
  Video,
  FileText,
  GraduationCap,
  Shield,
  DollarSign,
  Info,
  ArrowLeft
} from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

const bookingSchema = z.object({
  serviceType: z.enum(["hourly", "full-service"]),
  agentType: z.enum(["tax-professional", "tax-lawyer"]),
  consultationType: z.enum(["phone", "video", "in-person"]),
  preferredDate: z.date(),
  preferredTime: z.string(),
  description: z.string().min(10, "Please provide at least 10 characters describing your needs"),
  contactPhone: z.string().min(10, "Please provide a valid phone number"),
  contactEmail: z.string().email("Please provide a valid email address")
});

type BookingForm = z.infer<typeof bookingSchema>;

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];

const agentTypes = [
  {
    id: "tax-professional",
    title: "Certified Tax Professional",
    description: "Licensed tax preparers with extensive experience",
    qualifications: ["CPA or EA certification", "10+ years experience", "IRS enrolled agent"],
    hourlyRate: 150,
    fullServiceRate: 800
  },
  {
    id: "tax-lawyer",
    title: "Tax Attorney",
    description: "Licensed attorneys specializing in tax law",
    qualifications: ["JD with tax specialization", "Bar admission", "IRS representation"],
    hourlyRate: 300,
    fullServiceRate: 1500
  }
];

export default function HumanAgentPage() {
  const [step, setStep] = useState<"selection" | "booking" | "confirmation">("selection");
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const form = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceType: "hourly",
      agentType: "tax-professional",
      consultationType: "video",
      description: "",
      contactPhone: "",
      contactEmail: ""
    }
  });

  const onSubmit = (data: BookingForm) => {
    console.log("Booking submitted:", data);
    setStep("confirmation");
  };

  const selectedAgentInfo = agentTypes.find(agent => agent.id === form.watch("agentType"));
  const serviceType = form.watch("serviceType");
  const estimatedCost = selectedAgentInfo ? 
    (serviceType === "hourly" ? selectedAgentInfo.hourlyRate : selectedAgentInfo.fullServiceRate) : 0;

  if (step === "selection") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chat
            </Link>
            <h1 className="text-4xl font-bold mb-4">Connect with Tax Experts</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get personalized assistance from certified tax professionals or attorneys
            </p>
          </div>

          {/* Service Types */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <CardTitle>Hourly Consultation</CardTitle>
                </div>
                <CardDescription>
                  Get expert advice for specific tax questions or issues
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    One-on-one consultation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Flexible scheduling
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Pay per session
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Phone, video, or in-person
                  </li>
                </ul>
                <Button 
                  onClick={() => {
                    form.setValue("serviceType", "hourly");
                    setStep("booking");
                  }}
                  className="w-full"
                >
                  Book Hourly Session
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-green-600" />
                  <CardTitle>Full Tax Service</CardTitle>
                </div>
                <CardDescription>
                  Complete tax preparation and submission handled by experts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Complete tax preparation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Document review & filing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    IRS correspondence handling
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Ongoing support
                  </li>
                </ul>
                <Button 
                  onClick={() => {
                    form.setValue("serviceType", "full-service");
                    setStep("booking");
                  }}
                  className="w-full"
                  variant="default"
                >
                  Book Full Service
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Agent Types */}
          <div className="grid md:grid-cols-2 gap-6">
            {agentTypes.map((agent) => (
              <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    {agent.id === "tax-professional" ? (
                      <GraduationCap className="w-6 h-6 text-blue-600" />
                    ) : (
                      <Shield className="w-6 h-6 text-purple-600" />
                    )}
                    <CardTitle>{agent.title}</CardTitle>
                  </div>
                  <CardDescription>{agent.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Qualifications:</h4>
                    <ul className="space-y-1 text-sm">
                      {agent.qualifications.map((qual, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-600 mr-2" />
                          {qual}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Hourly Rate:</span>
                      <span className="font-semibold">${agent.hourlyRate}/hour</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Full Service:</span>
                      <span className="font-semibold">${agent.fullServiceRate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === "booking") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <Button variant="ghost" onClick={() => setStep("selection")} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Selection
            </Button>
            <h1 className="text-3xl font-bold mb-4">Book Your Consultation</h1>
            <p className="text-muted-foreground">
              Schedule your {form.watch("serviceType") === "hourly" ? "hourly consultation" : "full tax service"}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>
                Fill out the form below to schedule your appointment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Agent Type Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Choose Expert Type</Label>
                  <RadioGroup
                    value={form.watch("agentType")}
                    onValueChange={(value) => form.setValue("agentType", value as any)}
                  >
                    {agentTypes.map((agent) => (
                      <div key={agent.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value={agent.id} id={agent.id} />
                        <Label htmlFor={agent.id} className="flex-1 cursor-pointer">
                          <div className="font-medium">{agent.title}</div>
                          <div className="text-sm text-muted-foreground">{agent.description}</div>
                          <div className="text-sm font-semibold text-green-600">
                            {serviceType === "hourly" ? `$${agent.hourlyRate}/hour` : `$${agent.fullServiceRate} total`}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Separator />

                {/* Consultation Type */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Consultation Method</Label>
                  <RadioGroup
                    value={form.watch("consultationType")}
                    onValueChange={(value) => form.setValue("consultationType", value as any)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="video" id="video" />
                      <Label htmlFor="video" className="flex items-center cursor-pointer">
                        <Video className="w-4 h-4 mr-2" />
                        Video Call (Recommended)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="phone" id="phone" />
                      <Label htmlFor="phone" className="flex items-center cursor-pointer">
                        <Phone className="w-4 h-4 mr-2" />
                        Phone Call
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="in-person" id="in-person" />
                      <Label htmlFor="in-person" className="flex items-center cursor-pointer">
                        <Users className="w-4 h-4 mr-2" />
                        In-Person (Additional fees may apply)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                {/* Date and Time Selection */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Preferred Date</Label>
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {form.watch("preferredDate") ? 
                            format(form.watch("preferredDate"), "PPP") : 
                            "Pick a date"
                          }
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={form.watch("preferredDate")}
                          onSelect={(date) => {
                            if (date) {
                              form.setValue("preferredDate", date);
                              setIsCalendarOpen(false);
                            }
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Time</Label>
                    <RadioGroup
                      value={form.watch("preferredTime")}
                      onValueChange={(value) => form.setValue("preferredTime", value)}
                      className="grid grid-cols-3 gap-2"
                    >
                      {timeSlots.map((time) => (
                        <div key={time} className="flex items-center space-x-2">
                          <RadioGroupItem value={time} id={time} />
                          <Label htmlFor={time} className="text-sm cursor-pointer">
                            {time}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      {...form.register("contactPhone")}
                      placeholder="(555) 123-4567"
                    />
                    {form.formState.errors.contactPhone && (
                      <p className="text-sm text-red-600">{form.formState.errors.contactPhone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register("contactEmail")}
                      placeholder="your.email@example.com"
                    />
                    {form.formState.errors.contactEmail && (
                      <p className="text-sm text-red-600">{form.formState.errors.contactEmail.message}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Describe Your Tax Needs</Label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                    placeholder="Please describe your tax situation, specific questions, or services needed..."
                    rows={4}
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-red-600">{form.formState.errors.description.message}</p>
                  )}
                </div>

                {/* Cost Summary */}
                <Alert>
                  <DollarSign className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-semibold mb-2">Cost Summary:</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Service Type:</span>
                        <span className="capitalize">{serviceType.replace("-", " ")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expert Type:</span>
                        <span>{selectedAgentInfo?.title}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Estimated Cost:</span>
                        <span>${estimatedCost}</span>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>

                <Button type="submit" className="w-full" size="lg">
                  Schedule Consultation
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Confirmation step
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Consultation Scheduled!</h1>
          <p className="text-muted-foreground mb-8">
            Your request has been submitted successfully. A tax expert will contact you shortly to confirm your appointment.
          </p>

          <Card className="text-left mb-8">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Service Type:</span>
                <span className="font-semibold capitalize">{form.getValues("serviceType").replace("-", " ")}</span>
              </div>
              <div className="flex justify-between">
                <span>Expert Type:</span>
                <span className="font-semibold">{selectedAgentInfo?.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="font-semibold capitalize">{form.getValues("consultationType").replace("-", " ")}</span>
              </div>
              <div className="flex justify-between">
                <span>Preferred Date:</span>
                <span className="font-semibold">
                  {form.getValues("preferredDate") ? format(form.getValues("preferredDate"), "PPP") : "Not selected"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Preferred Time:</span>
                <span className="font-semibold">{form.getValues("preferredTime")}</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/">Return to Chat</Link>
            </Button>
            <Button variant="outline" onClick={() => setStep("selection")} className="w-full">
              Schedule Another Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}