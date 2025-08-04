import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "../../../shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, CheckCircle, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const securityQuestions = [
  "What was the name of your first pet?",
  "What is your mother's maiden name?",
  "What was the name of your first school?",
  "What city were you born in?",
  "What is your favorite color?",
  "What was your first car model?",
];

export default function Register() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [generatedUserId, setGeneratedUserId] = useState("");
  const { toast } = useToast();

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      pin: "",
      securityQuestion: "",
      securityAnswer: "",
    },
  });

  const onSubmit = async (data: InsertUser) => {
    try {
      // Since we're working frontend-only, simulate registration
      const mockUserId = `TAX${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setGeneratedUserId(mockUserId);
      setIsRegistered(true);
      
      toast({
        title: "Registration Successful!",
        description: "Your account has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-400">
              Registration Complete!
            </CardTitle>
            <CardDescription className="text-center">
              Your TaxAI Assistant account has been successfully created.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                Your Unique User ID:
              </p>
              <p className="text-lg font-mono font-bold text-blue-900 dark:text-blue-100 bg-white dark:bg-gray-800 p-2 rounded border">
                {generatedUserId}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                💡 Save this ID - you'll need it to log in to your account.
              </p>
            </div>
            
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/login">Continue to Login</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">Start Chatting</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calculator className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
          <CardDescription>
            Register with TaxAI Assistant using a secure PIN and security question
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pin">Create PIN (4-6 digits)</Label>
              <Input
                id="pin"
                type="password"
                placeholder="Enter 4-6 digit PIN"
                maxLength={6}
                {...form.register("pin")}
                className="text-center text-lg font-mono tracking-widest"
              />
              {form.formState.errors.pin && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.pin.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="securityQuestion">Security Question</Label>
              <Select
                value={form.watch("securityQuestion")}
                onValueChange={(value) => form.setValue("securityQuestion", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a security question" />
                </SelectTrigger>
                <SelectContent>
                  {securityQuestions.map((question, index) => (
                    <SelectItem key={index} value={question}>
                      {question}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.securityQuestion && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.securityQuestion.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="securityAnswer">Security Answer</Label>
              <Input
                id="securityAnswer"
                type="text"
                placeholder="Enter your answer"
                {...form.register("securityAnswer")}
              />
              {form.formState.errors.securityAnswer && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.securityAnswer.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}