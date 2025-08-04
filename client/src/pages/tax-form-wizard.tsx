import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Download,
  Info,
  User,
  DollarSign,
  Building,
  Home,
  Calculator,
  TrendingUp
} from "lucide-react";
import { Link } from "wouter";

interface FormStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  questions: Question[];
}

interface Question {
  id: string;
  type: "text" | "number" | "textarea" | "file" | "select";
  label: string;
  placeholder?: string;
  required: boolean;
  sampleAnswer?: string;
  options?: string[];
  helpText?: string;
  formSection?: string; // Which section of the actual tax form this maps to
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  questionId: string;
}

const formSteps: FormStep[] = [
  {
    id: "employment",
    title: "Employment Income",
    description: "Upload your salary statements and employment documents",
    icon: DollarSign,
    questions: [
      {
        id: "w2Documents",
        type: "file",
        label: "Upload W-2 Forms (Salary Statements)",
        required: true,
        helpText: "Upload all W-2 forms you received from employers for the tax year",
        formSection: "Form 1040, Line 1a - Supporting documentation"
      },
      {
        id: "paystubDocuments",
        type: "file",
        label: "Upload Final Pay Stubs",
        required: false,
        helpText: "Upload your final pay stub from each employer to verify annual earnings",
        formSection: "Supporting documentation for wage verification"
      },
      {
        id: "unemploymentBenefits",
        type: "file",
        label: "Upload 1099-G Forms (Unemployment Benefits)",
        required: false,
        helpText: "If you received unemployment benefits, upload the 1099-G form",
        formSection: "Form 1040, Line 7 - Supporting documentation"
      }
    ]
  },
  {
    id: "investments",
    title: "Investment Income",
    description: "Upload your investment and financial documents",
    icon: TrendingUp,
    questions: [
      {
        id: "investmentDocuments",
        type: "file",
        label: "Upload 1099-INT Forms (Interest Income)",
        required: false,
        helpText: "Upload forms showing interest earned from banks, savings accounts, and bonds",
        formSection: "Form 1040, Line 2b - Supporting documentation"
      },
      {
        id: "dividendDocuments",
        type: "file",
        label: "Upload 1099-DIV Forms (Dividend Income)",
        required: false,
        helpText: "Upload forms showing dividends received from stocks and mutual funds",
        formSection: "Form 1040, Line 3a - Supporting documentation"
      },
      {
        id: "brokerageStatements",
        type: "file",
        label: "Upload 1099-B Forms (Investment Sales)",
        required: false,
        helpText: "Upload forms showing proceeds from stock sales and other investment transactions",
        formSection: "Schedule D - Supporting documentation"
      },
      {
        id: "retirementDocuments",
        type: "file",
        label: "Upload 1099-R Forms (Retirement Distributions)",
        required: false,
        helpText: "Upload forms if you received distributions from retirement accounts",
        formSection: "Form 1040, Line 5a - Supporting documentation"
      }
    ]
  },
  {
    id: "deductions",
    title: "Deduction Documents",
    description: "Upload receipts and documents for tax deductions",
    icon: Calculator,
    questions: [
      {
        id: "mortgageDocuments",
        type: "file",
        label: "Upload 1098 Forms (Mortgage Interest)",
        required: false,
        helpText: "Upload mortgage interest statements from your lender",
        formSection: "Schedule A, Line 8a - Supporting documentation"
      },
      {
        id: "charitableDocuments",
        type: "file",
        label: "Upload Charitable Donation Receipts",
        required: false,
        helpText: "Upload receipts for donations over $250 and written acknowledgments",
        formSection: "Schedule A, Line 11 - Supporting documentation"
      },
      {
        id: "medicalDocuments",
        type: "file",
        label: "Upload Medical Expense Receipts",
        required: false,
        helpText: "Upload receipts for unreimbursed medical and dental expenses",
        formSection: "Schedule A, Line 1 - Supporting documentation"
      },
      {
        id: "educationDocuments",
        type: "file",
        label: "Upload 1098-T Forms (Education Expenses)",
        required: false,
        helpText: "Upload tuition statements for education tax credits",
        formSection: "Form 8863 - Supporting documentation"
      }
    ]
  },
  {
    id: "business",
    title: "Business Documentation",
    description: "Upload business income and expense documents",
    icon: Building,
    questions: [
      {
        id: "businessIncomeDocuments",
        type: "file",
        label: "Upload 1099-NEC Forms (Business Income)",
        required: false,
        helpText: "Upload forms showing non-employee compensation and business income",
        formSection: "Schedule C, Line 1 - Supporting documentation"
      },
      {
        id: "businessExpenseReceipts",
        type: "file",
        label: "Upload Business Expense Receipts",
        required: false,
        helpText: "Upload receipts for office supplies, equipment, travel, and other business expenses",
        formSection: "Schedule C, Various lines - Supporting documentation"
      },
      {
        id: "homeOfficeDocuments",
        type: "file",
        label: "Upload Home Office Documentation",
        required: false,
        helpText: "Upload utility bills, mortgage statements, or rent receipts for home office deduction",
        formSection: "Form 8829 - Supporting documentation"
      },
      {
        id: "vehicleDocuments",
        type: "file",
        label: "Upload Vehicle Expense Records",
        required: false,
        helpText: "Upload mileage logs or actual expense receipts for business vehicle use",
        formSection: "Schedule C, Line 9 - Supporting documentation"
      }
    ]
  }
];

const stepSchema = z.object({
  answers: z.record(z.string()),
});

type StepForm = z.infer<typeof stepSchema>;

export default function TaxFormWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [draftGenerated, setDraftGenerated] = useState(false);

  const form = useForm<StepForm>({
    resolver: zodResolver(stepSchema),
    defaultValues: {
      answers: {},
    },
  });

  const currentStepData = formSteps[currentStep];
  const progress = ((currentStep + 1) / formSteps.length) * 100;

  const handleFileUpload = (questionId: string, files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const uploadedFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        questionId
      };
      setUploadedFiles(prev => [...prev, uploadedFile]);
    });
  };

  const handleNext = (data: StepForm) => {
    setFormData(prev => ({ ...prev, ...data.answers }));
    
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      form.reset({ answers: {} });
    } else {
      generateDraft();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const generateDraft = async () => {
    setIsGeneratingDraft(true);
    
    // Simulate draft generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setDraftGenerated(true);
    setIsGeneratingDraft(false);
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(num || 0);
  };

  if (draftGenerated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Draft Tax Form Generated</h1>
                <p className="text-gray-600 dark:text-gray-300">Your personalized tax submission draft is ready</p>
              </div>
            </div>
            <Link href="/" className="inline-flex items-center text-primary hover:underline">
              ← Back to Chat Assistant
            </Link>
          </div>

          {/* Draft Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Tax Form 1040 - Draft Summary</span>
              </CardTitle>
              <CardDescription>
                Review your draft form and mapping to official sections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Document Summary */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <h3 className="text-lg font-semibold">Document Collection Summary</h3>
                </div>
                
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Documents Collected Successfully</h3>
                  <p className="text-muted-foreground mb-6">
                    You have uploaded {uploadedFiles.length} document{uploadedFiles.length !== 1 ? 's' : ''} that will be used to prepare your tax return.
                  </p>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg text-left">
                    <h4 className="font-semibold mb-2">Next Steps:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• A tax professional will review your uploaded documents</li>
                      <li>• Data will be extracted and verified for accuracy</li>
                      <li>• Your tax forms will be prepared based on the provided documents</li>
                      <li>• You will receive a complete draft for review before filing</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents */}
              {uploadedFiles.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Supporting Documents</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  This is a draft form based on the information you provided. Please review all values carefully and consult with a tax professional before submitting your actual tax return.
                </AlertDescription>
              </Alert>

              <div className="flex space-x-4">
                <Button className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download Draft PDF
                </Button>
                <Button variant="outline" onClick={() => setDraftGenerated(false)}>
                  Edit Information
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tax Form Wizard</h1>
              <p className="text-gray-600 dark:text-gray-300">Step-by-step guided tax form preparation</p>
            </div>
          </div>
          <Link href="/" className="inline-flex items-center text-primary hover:underline">
            ← Back to Chat Assistant
          </Link>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Step {currentStep + 1} of {formSteps.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Current Step */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Step Navigation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {formSteps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                
                return (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-3 p-2 rounded-lg ${
                      isCurrent ? 'bg-primary/10 border border-primary/20' : 
                      isCompleted ? 'bg-green-50 dark:bg-green-900/30' : 'bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCurrent ? 'bg-primary text-primary-foreground' :
                      isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <currentStepData.icon className="w-5 h-5" />
                  <span>{currentStepData.title}</span>
                </CardTitle>
                <CardDescription>{currentStepData.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(handleNext)} className="space-y-6">
                  {currentStepData.questions.map((question) => (
                    <div key={question.id} className="space-y-2">
                      <Label htmlFor={question.id} className="flex items-center space-x-2">
                        <span>{question.label}</span>
                        {question.required && <span className="text-red-500">*</span>}
                      </Label>
                      
                      {question.type === "text" && (
                        <Input
                          id={question.id}
                          type="text"
                          placeholder={question.placeholder}
                          {...form.register(`answers.${question.id}`)}
                        />
                      )}
                      
                      {question.type === "number" && (
                        <Input
                          id={question.id}
                          type="number"
                          placeholder={question.placeholder}
                          {...form.register(`answers.${question.id}`)}
                        />
                      )}
                      
                      {question.type === "textarea" && (
                        <Textarea
                          id={question.id}
                          placeholder={question.placeholder}
                          {...form.register(`answers.${question.id}`)}
                        />
                      )}
                      
                      {question.type === "select" && (
                        <select
                          id={question.id}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          {...form.register(`answers.${question.id}`)}
                        >
                          <option value="">Select an option</option>
                          {question.options?.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      )}
                      
                      {question.type === "file" && (
                        <div className="space-y-2">
                          <Input
                            id={question.id}
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            onChange={(e) => handleFileUpload(question.id, e.target.files)}
                          />
                          {uploadedFiles
                            .filter(file => file.questionId === question.id)
                            .map(file => (
                              <div key={file.id} className="text-sm text-muted-foreground">
                                📎 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                              </div>
                            ))}
                        </div>
                      )}
                      
                      {question.sampleAnswer && (
                        <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded text-sm">
                          <span className="text-blue-600 dark:text-blue-400 font-medium">Sample: </span>
                          <span className="font-mono">{question.sampleAnswer}</span>
                        </div>
                      )}
                      
                      {question.formSection && (
                        <Badge variant="outline" className="text-xs">
                          Maps to: {question.formSection}
                        </Badge>
                      )}
                      
                      {question.helpText && (
                        <p className="text-xs text-muted-foreground">{question.helpText}</p>
                      )}
                    </div>
                  ))}

                  <div className="flex space-x-4 pt-4">
                    {currentStep > 0 && (
                      <Button type="button" variant="outline" onClick={handlePrevious}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                    )}
                    
                    <Button type="submit" className="flex-1" disabled={isGeneratingDraft}>
                      {isGeneratingDraft ? (
                        "Generating Draft..."
                      ) : currentStep === formSteps.length - 1 ? (
                        <>
                          <FileText className="w-4 h-4 mr-2" />
                          Generate Draft Form
                        </>
                      ) : (
                        <>
                          Next Step
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}