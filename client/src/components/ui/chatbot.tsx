import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your healthcare assistant. I can help you with general health questions, symptom information, and guide you to appropriate care. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (chatRef.current) {
      const rect = chatRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      let newX = e.clientX - dragOffset.x;
      let newY = e.clientY - dragOffset.y;

      // Keep the chat within viewport bounds
      const chatWidth = 400;
      const chatHeight = 550;
      const buttonSize = 56; // Size of the toggle button

      // Constrain movement to keep both button and chat visible
      newX = Math.max(10, Math.min(newX, window.innerWidth - chatWidth - 10));
      newY = Math.max(10, Math.min(newY, window.innerHeight - chatHeight - 10));

      setPosition({
        x: newX,
        y: newY,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
  });

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const prompt = `You are a helpful healthcare assistant chatbot for Find My Clinic. You provide general health information, answer questions about symptoms, and help users find appropriate medical care. Always be empathetic, informative, and remind users that you're not a substitute for professional medical advice.

User question: ${content}

Please provide a helpful, accurate response. If the question involves serious symptoms or medical emergencies, strongly recommend seeking immediate professional medical help. Keep responses conversational and supportive.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const botResponse = response.text();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      let errorContent = "I'm sorry, I'm having trouble connecting right now. Please try again later or contact emergency services if this is urgent.";

      if (error instanceof Error) {
        if (error.message.includes('API_KEY') || error.message.includes('API key')) {
          errorContent = "I'm experiencing technical difficulties. Please check back later.";
        } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
          errorContent = "I'm currently busy helping other users. Please try again in a few minutes.";
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorContent = "I'm having trouble connecting. Please check your internet connection and try again.";
        }
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorContent,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* Draggable Floating Chatbot Toggle Button */}
      <div
        className="fixed z-50 cursor-move"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-secondary hover:shadow-xl hover:scale-110 transition-all duration-300 shadow-lg"
          size="icon"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Draggable Floating Chatbot Window */}
      {isOpen && (
        <div
          ref={chatRef}
          className="fixed z-50 cursor-move select-none"
          style={{
            left: `${Math.max(10, Math.min(position.x - 320, window.innerWidth - 410))}px`, // Keep chat window in bounds
            top: `${Math.max(10, Math.min(position.y - 550, window.innerHeight - 560))}px`,
          }}
          onMouseDown={handleMouseDown}
        >
          <Card className="w-96 h-[500px] shadow-2xl border-2 animate-fade-in">
            <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-secondary/5 cursor-move">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg truncate">
                  <Bot className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="truncate">Health Assistant</span>
                </CardTitle>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col h-full p-0">
              {/* Messages Area */}
              <ScrollArea className="flex-1 px-3">
                <div className="space-y-3 py-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.sender === 'bot' && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-2 ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      {message.sender === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="bg-muted rounded-lg px-3 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-3 bg-gradient-to-r from-primary/5 to-secondary/5">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about health concerns..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    size="icon"
                    className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  This is not medical advice. Consult healthcare professionals for medical concerns.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
