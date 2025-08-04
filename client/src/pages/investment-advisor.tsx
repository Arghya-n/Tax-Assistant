import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  Calculator, 
  DollarSign, 
  PieChart, 
  FileText, 
  ArrowRight,
  Lightbulb,
  Shield,
  Target,
  ExternalLink
} from "lucide-react";
import { Link } from "wouter";

const investmentFormSchema = z.object({
  monthlyIncome: z.string().min(1, "Monthly income is required"),
  currentAge: z.string().min(1, "Age is required"),
  filingStatus: z.string().min(1, "Filing status is required"),
  currentInvestments: z.string().optional(),
  investmentGoals: z.string().min(1, "Investment goals are required"),
});

type InvestmentForm = z.infer<typeof investmentFormSchema>;

interface InvestmentAdvice {
  maxTaxDeductibleAmount: number;
  recommendedMonthlyInvestment: number;
  estimatedTaxSavings: number;
  investmentStrategies: {
    strategy: string;
    maxContribution: number;
    taxBenefit: string;
    description: string;
  }[];
  additionalQuestions: string[];
  resources: { title: string; url: string; description: string }[];
}

const filingStatusOptions = [
  "Single",
  "Married Filing Jointly", 
  "Married Filing Separately",
  "Head of Household",
  "Qualifying Widow(er)"
];



export default function InvestmentAdvisor() {
  const [advice, setAdvice] = useState<InvestmentAdvice | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<InvestmentForm>({
    resolver: zodResolver(investmentFormSchema),
    defaultValues: {
      monthlyIncome: "",
      currentAge: "",
      filingStatus: "",
      currentInvestments: "",
      investmentGoals: "",
    },
  });

  const onSubmit = async (data: InvestmentForm) => {
    setIsGenerating(true);
    
    // Simulate API processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const monthlyIncome = parseFloat(data.monthlyIncome);
    const annualIncome = monthlyIncome * 12;
    
    // Mock calculation based on 2024 tax rules
    const mockAdvice: InvestmentAdvice = {
      maxTaxDeductibleAmount: Math.min(annualIncome * 0.15, 23000), // Simplified calculation
      recommendedMonthlyInvestment: Math.min(monthlyIncome * 0.15, 1900),
      estimatedTaxSavings: Math.min(annualIncome * 0.15, 23000) * 0.22, // Assuming 22% tax bracket
      investmentStrategies: [
        {
          strategy: "401(k) Contribution",
          maxContribution: 23000,
          taxBenefit: "Pre-tax deduction",
          description: "Maximize employer match if available, then contribute up to annual limit"
        },
        {
          strategy: "Traditional IRA",
          maxContribution: 7000,
          taxBenefit: "Tax-deductible contribution",
          description: "Additional retirement savings with immediate tax benefits"
        },
        {
          strategy: "Roth IRA",
          maxContribution: 7000,
          taxBenefit: "Tax-free growth",
          description: "Tax-free withdrawals in retirement, income limits apply"
        },
        {
          strategy: "HSA (if eligible)",
          maxContribution: 4300,
          taxBenefit: "Triple tax advantage",
          description: "Deductible contributions, tax-free growth, tax-free medical withdrawals"
        }
      ],
      additionalQuestions: [
        "Do you have access to an employer 401(k) match?",
        "Are you eligible for a Health Savings Account (HSA)?",
        "Do you have any existing retirement accounts?",
        "What are your specific retirement timeline goals?",
        "Are you considering any major life changes (marriage, home purchase, etc.)?"
      ],
      resources: [
        {
          title: "IRS Publication 590-A - Contributions to IRAs",
          url: "#",
          description: "Official IRS guide on IRA contribution rules and limits"
        },
        {
          title: "401(k) Plan Overview - Department of Labor",
          url: "#", 
          description: "Comprehensive guide to 401(k) plans and employer benefits"
        },
        {
          title: "Tax-Advantaged Investment Calculator",
          url: "#",
          description: "Interactive tool to calculate potential tax savings from investments"
        }
      ]
    };
    
    setAdvice(mockAdvice);
    setIsGenerating(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Investment Tax Advisor</h1>
              <p className="text-gray-600 dark:text-gray-300">Maximize your tax savings through smart investing</p>
            </div>
          </div>
          <Link href="/" className="inline-flex items-center text-primary hover:underline">
            ← Back to Chat Assistant
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-5 h-5" />
                <span>Your Financial Information</span>
              </CardTitle>
              <CardDescription>
                Provide your details to get personalized investment and tax advice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyIncome">Monthly Income ($)</Label>
                    <Input
                      id="monthlyIncome"
                      type="number"
                      placeholder="5000"
                      {...form.register("monthlyIncome")}
                    />
                    {form.formState.errors.monthlyIncome && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.monthlyIncome.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentAge">Age</Label>
                    <Input
                      id="currentAge"
                      type="number"
                      placeholder="30"
                      {...form.register("currentAge")}
                    />
                    {form.formState.errors.currentAge && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.currentAge.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filingStatus">Tax Filing Status</Label>
                  <Select
                    value={form.watch("filingStatus")}
                    onValueChange={(value) => form.setValue("filingStatus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your filing status" />
                    </SelectTrigger>
                    <SelectContent>
                      {filingStatusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.filingStatus && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.filingStatus.message}
                    </p>
                  )}
                </div>



                <div className="space-y-2">
                  <Label htmlFor="currentInvestments">Current Investments (Optional)</Label>
                  <Textarea
                    id="currentInvestments"
                    placeholder="Describe any existing investments, retirement accounts, or savings..."
                    {...form.register("currentInvestments")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="investmentGoals">Investment Goals</Label>
                  <Textarea
                    id="investmentGoals"
                    placeholder="What are your financial goals? (retirement, house down payment, emergency fund, etc.)"
                    {...form.register("investmentGoals")}
                  />
                  {form.formState.errors.investmentGoals && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.investmentGoals.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    "Generating Advice..."
                  ) : (
                    <>
                      <Target className="w-4 h-4 mr-2" />
                      Get Investment Advice
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-4">
            {advice ? (
              <>
                {/* Summary Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PieChart className="w-5 h-5" />
                      <span>Your Investment Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                        <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                          Max Tax-Deductible Investment
                        </p>
                        <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                          {formatCurrency(advice.maxTaxDeductibleAmount)}
                        </p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          Estimated Tax Savings
                        </p>
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                          {formatCurrency(advice.estimatedTaxSavings)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
                      <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                        Recommended Monthly Investment
                      </p>
                      <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                        {formatCurrency(advice.recommendedMonthlyInvestment)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Investment Strategies */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span>Recommended Investment Strategies</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {advice.investmentStrategies.map((strategy, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{strategy.strategy}</h4>
                          <Badge variant="secondary">
                            {formatCurrency(strategy.maxContribution)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {strategy.description}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {strategy.taxBenefit}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Additional Questions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5" />
                      <span>Additional Questions to Consider</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {advice.additionalQuestions.map((question, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <ArrowRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                          <span className="text-sm">{question}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Resources */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>Helpful Resources</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {advice.resources.map((resource, index) => (
                      <div key={index} className="border-l-4 border-primary pl-4">
                        <a
                          href={resource.url}
                          className="text-primary hover:underline font-medium flex items-center space-x-1"
                        >
                          <span>{resource.title}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <p className="text-sm text-muted-foreground mt-1">
                          {resource.description}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <DollarSign className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready to Get Started?</h3>
                  <p className="text-muted-foreground">
                    Fill out the form to receive personalized investment advice and tax optimization strategies.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}