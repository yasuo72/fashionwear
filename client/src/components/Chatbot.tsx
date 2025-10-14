import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  ShoppingCart,
  Package,
  CreditCard,
  MapPin,
  HelpCircle,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { useCart } from "@/hooks/useCart";
import { useLocation } from "wouter";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  suggestions?: string[];
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();
  
  const { data: authData } = useAuth();
  const { data: ordersData } = useOrders();
  const { data: cartData } = useCart();
  
  const user = authData?.user;
  const orders = ordersData?.orders || [];
  const cart = cartData?.cart;
  const cartItems = cart?.items || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      const welcomeMsg: Message = {
        id: Date.now().toString(),
        text: user 
          ? `Hi ${user.firstName}! 👋 I'm your FashionFusion assistant. How can I help you today?`
          : "Hi there! 👋 I'm your FashionFusion assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date(),
        suggestions: [
          "Track my order",
          "View my cart",
          "Help with checkout",
          "Return policy",
          "Contact support"
        ]
      };
      setMessages([welcomeMsg]);
    }
  }, [isOpen, user]);

  const getBotResponse = (userMessage: string): Message => {
    const lowerMsg = userMessage.toLowerCase();
    let responseText = "";
    let suggestions: string[] = [];

    // Order tracking
    if (lowerMsg.includes("track") || lowerMsg.includes("order") || lowerMsg.includes("delivery")) {
      if (!user) {
        responseText = "Please sign in to track your orders. You can login from the top right corner.";
        suggestions = ["How to sign in?", "Create account"];
      } else if (orders.length === 0) {
        responseText = "You don't have any orders yet. Start shopping to place your first order! 🛍️";
        suggestions = ["Browse products", "View categories", "Check deals"];
      } else {
        const latestOrder = orders[0];
        responseText = `Your latest order #${latestOrder.orderNumber} is ${latestOrder.status}. `;
        
        if (latestOrder.status === "pending") {
          responseText += "We're processing your order and will ship it soon!";
        } else if (latestOrder.status === "processing") {
          responseText += "Your order is being prepared for shipment.";
        } else if (latestOrder.status === "shipped") {
          responseText += "Your order is on the way! 🚚";
        } else if (latestOrder.status === "delivered") {
          responseText += "Your order has been delivered! Hope you love it! ❤️";
        }
        
        responseText += `\n\nYou have ${orders.length} total order(s).`;
        suggestions = ["View all orders", "Order details", "Need help?"];
      }
    }
    
    // Cart help
    else if (lowerMsg.includes("cart") || lowerMsg.includes("basket")) {
      if (!user) {
        responseText = "Please sign in to view your cart.";
        suggestions = ["Sign in", "Continue as guest"];
      } else if (cartItems.length === 0) {
        responseText = "Your cart is empty. Let's find something amazing for you! ✨";
        suggestions = ["Browse products", "New arrivals", "Sale items"];
      } else {
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        responseText = `You have ${cartItems.length} item(s) in your cart worth ₹${total.toFixed(0)}. Ready to checkout?`;
        suggestions = ["View cart", "Proceed to checkout", "Continue shopping"];
      }
    }
    
    // Checkout help
    else if (lowerMsg.includes("checkout") || lowerMsg.includes("payment") || lowerMsg.includes("pay")) {
      responseText = "Here's how to complete your checkout:\n\n" +
        "1️⃣ Add items to cart\n" +
        "2️⃣ Click 'Proceed to Checkout'\n" +
        "3️⃣ Add/select delivery address\n" +
        "4️⃣ Choose payment method (Card/UPI/COD)\n" +
        "5️⃣ Review and place order\n\n" +
        "We accept all major cards and UPI payments!";
      suggestions = ["Payment methods", "Add address", "Need help?"];
    }
    
    // Shipping & delivery
    else if (lowerMsg.includes("shipping") || lowerMsg.includes("delivery") || lowerMsg.includes("ship")) {
      responseText = "🚚 Shipping Information:\n\n" +
        "• Free shipping on orders above ₹4,149\n" +
        "• Standard shipping: ₹830\n" +
        "• Delivery in 3-7 business days\n" +
        "• Track your order anytime!\n\n" +
        "We deliver across India! 🇮🇳";
      suggestions = ["Track order", "Delivery time", "Shipping cost"];
    }
    
    // Returns & refunds
    else if (lowerMsg.includes("return") || lowerMsg.includes("refund") || lowerMsg.includes("exchange")) {
      responseText = "📦 Return & Exchange Policy:\n\n" +
        "• 30-day return window\n" +
        "• Free returns on all orders\n" +
        "• Easy exchange process\n" +
        "• Full refund within 7-10 days\n\n" +
        "Items must be unused with original tags.";
      suggestions = ["How to return?", "Refund status", "Contact support"];
    }
    
    // Account help
    else if (lowerMsg.includes("account") || lowerMsg.includes("profile") || lowerMsg.includes("sign in") || lowerMsg.includes("login")) {
      if (!user) {
        responseText = "To create an account or sign in:\n\n" +
          "1. Click the user icon in top right\n" +
          "2. Choose 'Sign In' or 'Register'\n" +
          "3. Enter your details\n\n" +
          "Benefits: Track orders, save addresses, faster checkout!";
        suggestions = ["Create account", "Forgot password?", "Guest checkout"];
      } else {
        responseText = `You're signed in as ${user.firstName} ${user.lastName}! 🎉\n\n` +
          "You can manage your profile, addresses, and view order history from your account.";
        suggestions = ["View profile", "My orders", "Saved addresses"];
      }
    }
    
    // Product search
    else if (lowerMsg.includes("find") || lowerMsg.includes("search") || lowerMsg.includes("looking for")) {
      responseText = "🔍 To find products:\n\n" +
        "• Use the search bar at the top\n" +
        "• Browse by categories\n" +
        "• Check out our featured collections\n" +
        "• Filter by price, size, color\n\n" +
        "What are you looking for today?";
      suggestions = ["Men's wear", "Women's wear", "Accessories", "Sale items"];
    }
    
    // Discounts & offers
    else if (lowerMsg.includes("discount") || lowerMsg.includes("offer") || lowerMsg.includes("coupon") || lowerMsg.includes("sale")) {
      responseText = "🎁 Current Offers:\n\n" +
        "• Free shipping on orders ₹4,149+\n" +
        "• Check our Sales page for deals\n" +
        "• Sign up for exclusive discounts\n" +
        "• Apply coupon codes at checkout\n\n" +
        "Save big on your favorite styles!";
      suggestions = ["View sales", "Apply coupon", "Sign up offers"];
    }
    
    // Contact & support
    else if (lowerMsg.includes("contact") || lowerMsg.includes("support") || lowerMsg.includes("help") || lowerMsg.includes("customer service")) {
      responseText = "📞 Contact Support:\n\n" +
        "• Email: support@fashionfusion.com\n" +
        "• Phone: +91 1800-123-4567\n" +
        "• Chat: Right here! 💬\n" +
        "• Hours: 9 AM - 9 PM (Mon-Sat)\n\n" +
        "We're here to help!";
      suggestions = ["Common issues", "Track order", "Return item"];
    }
    
    // Size guide
    else if (lowerMsg.includes("size") || lowerMsg.includes("fit") || lowerMsg.includes("measurement")) {
      responseText = "📏 Size Guide:\n\n" +
        "Each product has a detailed size chart. Look for the 'Size Guide' button on product pages.\n\n" +
        "Tips:\n" +
        "• Check measurements carefully\n" +
        "• Read customer reviews for fit\n" +
        "• Contact us if unsure\n\n" +
        "We want you to get the perfect fit!";
      suggestions = ["Size chart", "How to measure?", "Exchange size"];
    }
    
    // Greetings
    else if (lowerMsg.includes("hi") || lowerMsg.includes("hello") || lowerMsg.includes("hey")) {
      responseText = "Hello! 👋 Great to chat with you! How can I assist you today?";
      suggestions = ["Track order", "View cart", "Browse products", "Need help?"];
    }
    
    // Thanks
    else if (lowerMsg.includes("thank") || lowerMsg.includes("thanks")) {
      responseText = "You're welcome! 😊 Is there anything else I can help you with?";
      suggestions = ["Track order", "View products", "Contact support"];
    }
    
    // Default response
    else {
      responseText = "I'm here to help! I can assist you with:\n\n" +
        "• 📦 Order tracking & status\n" +
        "• 🛒 Cart & checkout help\n" +
        "• 🚚 Shipping information\n" +
        "• 🔄 Returns & exchanges\n" +
        "• 💳 Payment methods\n" +
        "• 👤 Account management\n\n" +
        "What would you like to know?";
      suggestions = ["Track my order", "Shipping info", "Return policy", "Contact support"];
    }

    return {
      id: Date.now().toString(),
      text: responseText,
      sender: "bot",
      timestamp: new Date(),
      suggestions
    };
  };

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(messageText);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Handle navigation actions
    const lowerSuggestion = suggestion.toLowerCase();
    
    if (lowerSuggestion.includes("view all orders") || lowerSuggestion.includes("my orders")) {
      setLocation("/orders");
      setIsOpen(false);
      return;
    }
    
    if (lowerSuggestion.includes("order details") && orders.length > 0) {
      setLocation(`/orders/${orders[0]._id}`);
      setIsOpen(false);
      return;
    }
    
    if (lowerSuggestion.includes("view cart")) {
      setLocation("/cart");
      setIsOpen(false);
      return;
    }
    
    if (lowerSuggestion.includes("proceed to checkout") || lowerSuggestion.includes("checkout")) {
      setLocation("/checkout");
      setIsOpen(false);
      return;
    }
    
    if (lowerSuggestion.includes("browse products") || lowerSuggestion.includes("continue shopping")) {
      setLocation("/");
      setIsOpen(false);
      return;
    }
    
    if (lowerSuggestion.includes("view profile")) {
      setLocation("/profile");
      setIsOpen(false);
      return;
    }
    
    if (lowerSuggestion.includes("view sales") || lowerSuggestion.includes("sale items")) {
      setLocation("/sales");
      setIsOpen(false);
      return;
    }
    
    if (lowerSuggestion.includes("sign in") || lowerSuggestion.includes("create account")) {
      setLocation("/login");
      setIsOpen(false);
      return;
    }
    
    // For other suggestions, send as message
    handleSendMessage(suggestion);
  };

  return (
    <>
      {/* Chat Button - Floating */}
      {!isOpen && (
        <div 
          className="fixed z-[9999]" 
          style={{ bottom: '30px', right: '24px' }}
        >
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full shadow-xl hover:scale-110 transition-all duration-300 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 hover:shadow-purple-500/50 border-2 border-white dark:border-gray-800"
            size="icon"
          >
            <MessageCircle className="h-6 w-6 text-white" />
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <Sparkles className="h-3 w-3 text-white" />
            </span>
          </Button>
        </div>
      )}

      {/* Chat Window - Floating */}
      {isOpen && (
        <div 
          className="fixed z-[9999]" 
          style={{ bottom: '120px', right: '24px' }}
        >
          <Card className="w-[90vw] max-w-[420px] h-[70vh] max-h-[680px] shadow-2xl flex flex-col border-2 border-primary/20 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">FashionFusion Assistant</h3>
                <p className="text-xs opacity-90">Always here to help! 💬</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-primary-foreground/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id}>
                  <div
                    className={`flex gap-2 ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.sender === "bot" && (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    {message.sender === "user" && (
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Suggestions */}
                  {message.sender === "bot" && message.suggestions && (
                    <div className="flex flex-wrap gap-2 mt-2 ml-10">
                      {message.suggestions.map((suggestion, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Powered by FashionFusion AI ✨
            </p>
          </div>
          </Card>
        </div>
      )}
    </>
  );
}
