import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserSchema, type LoginUser } from "../../../shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<LoginUser>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      userId: "",
      pin: "",
    },
  });

  const onSubmit = async (data: LoginUser) => {
    try {
      // Since we're working frontend-only, simulate login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation - in real app this would be handled by backend
      if (data.userId.length > 3 && data.pin.length >= 4) {
        toast({
          title: "Login Successful!",
          description: "Welcome back to TaxAI Assistant.",
        });
        
        // Store auth state in localStorage for this demo
        localStorage.setItem("taxai_user", JSON.stringify({ 
          userId: data.userId, 
          loggedIn: true 
        }));
        
        setLocation("/");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid User ID or PIN. Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calculator className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your TaxAI Assistant account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                type="text"
                placeholder="Enter your User ID (e.g., TAX12345678)"
                {...form.register("userId")}
                className="font-mono"
              />
              {form.formState.errors.userId && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.userId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin">PIN</Label>
              <Input
                id="pin"
                type="password"
                placeholder="Enter your PIN"
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

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                "Signing In..."
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Create Account
                </Link>
              </p>
              <p className="text-sm text-muted-foreground">
                Forgot your User ID?{" "}
                <button className="text-primary hover:underline">
                  Recover Account
                </button>
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p className="text-xs text-blue-600 dark:text-blue-400">
              💡 <strong>New to TaxAI?</strong> Create an account with just a PIN and security question. 
              You'll get a unique User ID for future logins.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}