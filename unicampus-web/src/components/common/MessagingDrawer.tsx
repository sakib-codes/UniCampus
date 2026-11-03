"use client";

import { useState, useEffect, useRef } from "react";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import Link from "next/link";
import { 
  X, 
  Send, 
  Search, 
  CheckCheck, 
  Clock, 
  Sparkles, 
  UserCheck, 
  GraduationCap, 
  Circle,
  Paperclip,
  MoreVertical,
  MessageSquare,
  Maximize2,
  ArrowLeft
} from "lucide-react";
import { themeTokens } from "@/lib/theme";
import { useAdminAuth } from "@/context/AdminAuthContext";

export interface MessageItem {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isOnline: boolean;
  unreadCount: number;
  lastMessage: string;
  lastTime: string;
  messages: MessageItem[];
}

const STUDENT_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    name: "Dr. Asif Rahman",
    role: "Associate Professor • CSE Advisor",
    avatar: "",
    isOnline: true,
    unreadCount: 1,
    lastMessage: "Please review the 3NF decomposition slides before the next session.",
    lastTime: "10:14 AM",
    messages: [
      { id: "m1", sender: "them", text: "Good morning Sakib. Did you check the feedback on your relational algebra problem set?", time: "10:05 AM" },
      { id: "m2", sender: "me", text: "Yes sir! I updated the query tree and pushed it to the repository.", time: "10:10 AM" },
      { id: "m3", sender: "them", text: "Please review the 3NF decomposition slides before the next session.", time: "10:14 AM" }
    ]
  },
  {
    id: "conv-2",
    name: "CSE Batch '26 Cohort",
    role: "Department Study Group",
    avatar: "",
    isOnline: true,
    unreadCount: 3,
    lastMessage: "Has anyone verified the AI lab dataset format?",
    lastTime: "09:45 AM",
    messages: [
      { id: "c1", sender: "them", text: "Hey everyone, don't forget mid-term exam registration deadline this Thursday!", time: "09:30 AM" },
      { id: "c2", sender: "me", text: "Already submitted and cleared from accounts.", time: "09:38 AM" },
      { id: "c3", sender: "them", text: "Has anyone verified the AI lab dataset format?", time: "09:45 AM" }
    ]
  },
  {
    id: "conv-3",
    name: "Registrar Helpdesk",
    role: "Academic Affairs Office",
    avatar: "",
    isOnline: false,
    unreadCount: 0,
    lastMessage: "Your clearance for 6th Semester courses is active.",
    lastTime: "Yesterday",
    messages: [
      { id: "r1", sender: "them", text: "Your clearance for 6th Semester courses is active. Hall ticket will generate automatically.", time: "Yesterday" }
    ]
  }
];

const TEACHER_CONVERSATIONS: Conversation[] = [
  {
    id: "t-conv-1",
    name: "Sakib Ahmed",
    role: "Student (211-15-4424) • Sec-A",
    avatar: "",
    isOnline: true,
    unreadCount: 1,
    lastMessage: "Sir, can I visit your cabin during today's 2 PM consultation hour?",
    lastTime: "11:20 AM",
    messages: [
      { id: "tm1", sender: "them", text: "Sir, can I visit your cabin during today's 2 PM consultation hour?", time: "11:20 AM" }
    ]
  },
  {
    id: "t-conv-2",
    name: "Anika Tabassum",
    role: "Student (211-15-4425) • Sec-A",
    avatar: "",
    isOnline: true,
    unreadCount: 0,
    lastMessage: "Thank you for the guidance on capstone proposal sir!",
    lastTime: "09:15 AM",
    messages: [
      { id: "ta1", sender: "them", text: "Submitted the capstone project proposal draft to your email.", time: "09:00 AM" },
      { id: "ta2", sender: "me", text: "Approved the methodology section. Proceed with dataset collection.", time: "09:12 AM" },
      { id: "ta3", sender: "them", text: "Thank you for the guidance on capstone proposal sir!", time: "09:15 AM" }
    ]
  },
  {
    id: "t-conv-3",
    name: "Dr. Shahriar Hossain",
    role: "Dean • Faculty of Engineering",
    avatar: "",
    isOnline: false,
    unreadCount: 0,
    lastMessage: "Please verify CSE-311 midterm grade submission by Friday.",
    lastTime: "Yesterday",
    messages: [
      { id: "td1", sender: "them", text: "Please verify CSE-311 midterm grade submission by Friday.", time: "Yesterday" }
    ]
  }
];

interface MessagingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialPeerName?: string | null;
}

export function MessagingDrawer({ isOpen, onClose, initialPeerName }: MessagingDrawerProps) {
  const { currentUser } = useAdminAuth();
  const isTeacher = currentUser?.role === "teacher";
  const baseConversations = isTeacher ? TEACHER_CONVERSATIONS : STUDENT_CONVERSATIONS;

  const resolveInitialId = (peerName?: string | null) => {
    if (peerName) {
      const match = baseConversations.find(
        (c) => c.name.toLowerCase() === peerName.toLowerCase()
      );
      if (match) return match.id;
    }
    return baseConversations[0]?.id ?? "";
  };

  const [conversations, setConversations] = useState<Conversation[]>(baseConversations);
  const [activeConvId, setActiveConvId] = useState<string>(resolveInitialId(initialPeerName));
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileThreadOpen, setIsMobileThreadOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setConversations(isTeacher ? TEACHER_CONVERSATIONS : STUDENT_CONVERSATIONS);
    setActiveConvId(resolveInitialId(initialPeerName));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTeacher, initialPeerName]);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, activeConv?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    // A conversation whose every message was sent by the reader is a self-thread.
    const isSelfThread =
      activeConv.messages.length > 0 &&
      activeConv.messages.every((m) => m.sender === "me");
    if (isSelfThread) return;

    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      sender: "me",
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id !== activeConv.id) return conv;
      return {
        ...conv,
        lastMessage: newMsg.text,
        lastTime: newMsg.time,
        unreadCount: 0,
        messages: [...conv.messages, newMsg]
      };
    }));

    setInputText("");

    // Simulate smart auto-reply after 1.5s
    setTimeout(() => {
      const replyMsg: MessageItem = {
        id: `reply-${Date.now()}`,
        sender: "them",
        text: isTeacher 
          ? "Acknowledged sir, thank you!" 
          : "Noted Sakib. We will discuss this during today's scheduled hour.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setConversations(prev => prev.map(conv => {
        if (conv.id !== activeConv.id) return conv;
        return {
          ...conv,
          lastMessage: replyMsg.text,
          lastTime: replyMsg.time,
          messages: [...conv.messages, replyMsg]
        };
      }));
    }, 1500);
  };

  // Body scroll lock while drawer is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div 
        className={`w-full max-w-2xl h-full ${themeTokens.surface} border-l ${themeTokens.border} shadow-2xl flex flex-col md:flex-row min-h-0`}
      >
        {/* Left Side: Conversation Contacts List */}
        <div className={`w-full md:w-72 border-r ${themeTokens.border} flex-col h-full min-h-0 bg-slate-50/50 dark:bg-[#010409]/60 shrink-0 ${isMobileThreadOpen ? 'hidden md:flex' : 'flex'}`}>
          {/* Header */}
          <div className={`p-4 border-b ${themeTokens.border} flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand/10 text-brand flex items-center justify-center font-bold">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-[#F0F6FC]">Campus Messenger</h3>
                <p className={`text-[10px] ${themeTokens.textMuted}`}>Direct Academic Comms</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg cursor-pointer"
              title="Close campus messenger"
              aria-label="Close campus messenger"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Contacts */}
          <div className="p-3">
            <div className="relative">
              <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${themeTokens.textMuted}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats, professors..."
                aria-label="Search chats, professors"
                className={`w-full pl-8 pr-3 py-1.5 text-xs font-medium ${themeTokens.input}`}
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto px-2 space-y-1">
            {filteredConversations.map(conv => {
              const isSelected = conv.id === activeConv?.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => {
                    setActiveConvId(conv.id);
                    setIsMobileThreadOpen(true);
                    setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c));
                  }}
                  className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected 
                      ? `${themeTokens.surface} border border-brand/30 shadow-sm` 
                      : `hover:bg-slate-100 dark:hover:bg-[#161B22]`
                  }`}
                >
                  <div className="relative shrink-0">
                    <ProfileAvatar
                      size="md"
                      className="border border-slate-200 dark:border-[#30363D]"
                    />
                    {conv.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0D1117]"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className={`font-bold text-xs truncate ${isSelected ? 'text-brand' : 'text-slate-900 dark:text-[#F0F6FC]'}`}>
                        {conv.name}
                      </p>
                      <span className={`text-[10px] font-mono ${themeTokens.textMuted}`}>{conv.lastTime}</span>
                    </div>
                    <p className={`text-[10px] ${themeTokens.textMuted} truncate mb-1`}>{conv.role}</p>
                    <p className="text-[11px] text-slate-500 dark:text-[#8D96A0] truncate font-medium">
                      {conv.lastMessage}
                    </p>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-brand text-white font-mono text-[9px] font-bold flex items-center justify-center shrink-0 mt-1">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Chat Active Thread */}
        <div className={`flex-1 flex-col h-full min-h-0 bg-white dark:bg-[#0D1117] ${isMobileThreadOpen ? 'flex' : 'hidden md:flex'}`}>
          {/* Thread Header */}
          {activeConv ? (
            <div className={`p-4 border-b ${themeTokens.border} flex items-center justify-between bg-slate-50/40 dark:bg-[#010409]/40`}>
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setIsMobileThreadOpen(false)}
                  className="md:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-800 dark:text-[#8D96A0] dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-[#161B22] cursor-pointer"
                  title="Back to Conversations"
                  aria-label="Back to Conversations"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div className="relative shrink-0">
                  <ProfileAvatar
                    className="w-9 h-9 border border-slate-200 dark:border-[#30363D]"
                    iconClassName="w-4 h-4"
                  />
                  {activeConv.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0D1117]"></span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-[#F0F6FC] truncate">
                      {activeConv.name}
                    </h4>
                    {activeConv.isOnline && (
                      <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">• Active</span>
                    )}
                  </div>
                  <p className={`text-[10px] ${themeTokens.textMuted} truncate`}>{activeConv.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Link
                  href="/messages"
                  onClick={onClose}
                  title="Expand to Full Page Messenger"
                  className="p-1.5 text-slate-400 hover:text-brand dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-[#161B22] cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" />
                </Link>

                <button 
                  onClick={onClose}
                  title="Close Messenger"
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-[#161B22] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : null}

          {/* Message Bubbles Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {activeConv?.messages.map(msg => {
              const isMe = msg.sender === "me";
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed shadow-xs ${
                      isMe 
                        ? 'bg-brand text-white rounded-br-xs' 
                        : `${themeTokens.cardRecessed} text-slate-800 dark:text-[#F0F6FC] rounded-bl-xs`
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className={`text-[9px] font-mono ${themeTokens.textMuted} mt-1 px-1`}>
                    {msg.time} {isMe && "• Delivered"}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Composer Input Area */}
          <form onSubmit={handleSendMessage} className={`p-3 border-t ${themeTokens.border} flex items-center gap-2 bg-slate-50/50 dark:bg-[#010409]/60`}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Reply to ${activeConv?.name}...`}
              className={`flex-1 px-3.5 py-2 text-xs font-medium ${themeTokens.input}`}
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`${themeTokens.btnPrimary} px-4 py-2 text-xs flex items-center gap-1.5 disabled:opacity-40 cursor-pointer`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

