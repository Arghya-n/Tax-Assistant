import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calculator, Bot, User, Send, Paperclip, ExternalLink, FileText, BookOpen, Gavel, Bus, ChartLine, File, LogIn, UserPlus, LogOut, Menu, TrendingUp, Edit3, Users } from "lucide-react";
import { Link } from "wouter";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  links?: { text: string; url: string; icon: string }[];
}

interface MockResponse {
  message: string;
  links?: { text: string; url: string; icon: string }[];
}

const mockResponses: MockResponse[] = [
  {
    message: "I'd be happy to help with that! Tax laws can be complex, but I'll break it down for you.",
    links: [
      { text: "IRS Tax Guide", url: "#", icon: "book" },
      { text: "Tax Calculator", url: "#", icon: "calculator" }
    ]
  },
  {
    message: "Based on current tax regulations, here's what you need to know:",
    links: [
      { text: "Official IRS Publication", url: "#", icon: "file" },
      { text: "Tax Planning Resources", url: "#", icon: "chart" }
    ]
  },
  {
    message: "That's an excellent question! Let me provide you with the most up-to-date information:",
    links: [
      { text: "Tax Code Reference", url: "#", icon: "gavel" },
      { text: "Professional Consultation", url: "#", icon: "user" }
    ]
  },
  {
    message: "Great question! For home office deductions, you have two main options:\n\n**1. Simplified Method:** Deduct $5 per square foot (up to 300 sq ft, max $1,500)\n\n**2. Actual Expense Method:** Calculate percentage of home used for business",
    links: [
      { text: "IRS Publication 587 - Business Use of Home", url: "#", icon: "external" },
      { text: "Home Office Deduction Calculator", url: "#", icon: "calculator" }
    ]
  },
  {
    message: "Yes! For 2024, business meal deductions are generally 50% of the cost, but there are some important exceptions:\n\n**🍽️ 100% Deductible:**\n• Office snacks and meals for employees\n• Company picnics and holiday parties\n• Meals during business travel\n\n**📊 50% Deductible:**\n• Client entertainment meals\n• Business meetings at restaurants\n• Networking event meals",
    links: [
      { text: "Business Meal Expense Tracker Template", url: "#", icon: "file" },
      { text: "IRS Guidelines for Business Meals", url: "#", icon: "external" }
    ]
  },
  {
    message: "Smart investing can significantly reduce your tax burden! For 2024:\n\n**💼 401(k) Contributions:** Up to $23,000 (pre-tax)\n**🏦 IRA Contributions:** Up to $7,000 (traditional = tax deductible)\n**🏥 HSA Contributions:** Up to $4,300 (triple tax advantage)\n\nBased on your income, you could potentially save thousands in taxes through strategic investing. Would you like personalized investment advice?",
    links: [
      { text: "Get Investment Tax Advice", url: "/investment-advisor", icon: "chart" },
      { text: "IRS Publication 590 - IRAs", url: "#", icon: "external" }
    ]
  },
  {
    message: "Filing your taxes doesn't have to be overwhelming! I can help you prepare your tax forms step-by-step:\n\n**📋 What you'll need:**\n• W-2 forms from employers\n• 1099 forms for interest/dividends\n• Receipts for deductions\n• Previous year's tax return\n\n**🎯 Our Tax Form Wizard** guides you through each section with sample answers and maps your information to the correct form fields. Ready to get started?",
    links: [
      { text: "Start Tax Form Wizard", url: "/tax-form-wizard", icon: "file" },
      { text: "Tax Document Checklist", url: "#", icon: "external" }
    ]
  },
  {
    message: "Need personalized assistance with complex tax situations? Connect with our certified tax professionals and attorneys for expert guidance:\n\n**👥 Available Services:**\n• Hourly consultations for specific questions\n• Full-service tax preparation and filing\n• Expert review of complex situations\n• IRS correspondence assistance\n\n**🎓 Our Experts:**\n• Certified Public Accountants (CPAs)\n• Enrolled Agents (EAs)\n• Licensed Tax Attorneys\n\nChoose between phone, video, or in-person consultations. Ready to get professional help?",
    links: [
      { text: "Connect with Tax Expert", url: "/human-agent", icon: "user" },
      { text: "Learn About Our Experts", url: "#", icon: "external" }
    ]
  }
];

const quickSuggestions = [
  "Tax deadlines 2024",
  "Standard deduction",
  "Business expenses",
  "Investment tax savings",
  "Tax form preparation",
  "Connect with tax expert"
];

const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    book: BookOpen,
    calculator: Calculator,
    file: FileText,
    chart: ChartLine,
    gavel: Gavel,
    user: Bus,
    external: ExternalLink,
    pdf: File
  };
  return iconMap[iconName] || ExternalLink;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "👋 Hello! I'm your AI tax assistant. I can help you with tax questions, deductions, filing requirements, and more. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Check if user is logged in
  const [user, setUser] = useState<{ userId: string; loggedIn: boolean } | null>(() => {
    const stored = localStorage.getItem("taxai_user");
    return stored ? JSON.parse(stored) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("taxai_user");
    setUser(null);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || inputValue.trim();
    if (!content) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse.message,
        isUser: false,
        timestamp: new Date(),
        links: randomResponse.links,
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={index} className="font-semibold text-slate-800 mt-2">{line.slice(2, -2)}</p>;
      }
      if (line.startsWith('•')) {
        return <p key={index} className="ml-4 text-sm">{line}</p>;
      }
      return <p key={index} className={index > 0 ? 'mt-2' : ''}>{line}</p>;
    });
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-xl">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Calculator className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">TaxAI Assistant</h1>
              <p className="text-primary-foreground/80 text-sm">
                {user ? `Welcome, ${user.userId}` : "Professional Tax Consultation"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-primary-foreground/80 text-sm">Online</span>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/20">
                  <Menu className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/investment-advisor" className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Investment Tax Advisor
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/tax-form-wizard" className="flex items-center">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Tax Form Wizard
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/human-agent" className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Connect with Tax Expert
                  </Link>
                </DropdownMenuItem>
                
                {user ? (
                  <>
                    <DropdownMenuItem disabled className="font-medium">
                      Signed in as {user.userId}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="flex items-center">
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register" className="flex items-center">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Create Account
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ backgroundColor: 'var(--chat-background)' }}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 animate-fade-in ${
              message.isUser ? 'justify-end' : ''
            }`}
          >
            {message.isUser ? (
              <>
                <div className="bg-primary text-primary-foreground rounded-lg px-4 py-3 max-w-xs sm:max-w-md">
                  <p>{message.content}</p>
                  <span className="text-xs text-primary-foreground/70 mt-2 block">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="text-muted-foreground w-4 h-4" />
                </div>
              </>
            ) : (
              <>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="text-primary-foreground w-4 h-4" />
                </div>
                <div className="bg-white rounded-lg px-4 py-3 max-w-xs sm:max-w-lg shadow-sm border border-border">
                  <div className="text-slate-700">
                    {formatMessageContent(message.content)}
                  </div>
                  
                  {message.links && message.links.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-sm text-muted-foreground">📋 Helpful resources:</p>
                      <ul className="mt-2 space-y-1">
                        {message.links.map((link, index) => {
                          const IconComponent = getIconComponent(link.icon);
                          return (
                            <li key={index}>
                              <a
                                href={link.url}
                                className="text-primary hover:text-primary/80 text-sm underline flex items-center gap-1"
                              >
                                <IconComponent className="w-3 h-3" />
                                {link.text}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  
                  <span className="text-xs text-muted-foreground mt-3 block">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start space-x-3 animate-fade-in">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="text-primary-foreground w-4 h-4" />
            </div>
            <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-border">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-white p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex space-x-3"
        >
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Ask me anything about taxes..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-12"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Paperclip className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer" />
            </div>
          </div>
          <Button type="submit" className="flex items-center space-x-2">
            <span className="hidden sm:inline">Send</span>
            <Send className="w-4 h-4" />
          </Button>
        </form>

        {/* Quick Suggestions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {quickSuggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs px-3 py-1 h-auto"
              onClick={() => handleSendMessage(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
