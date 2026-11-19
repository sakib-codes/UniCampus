"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  X,
  Send,
  Search,
  MessageSquare,
  Maximize2,
  ArrowLeft,
} from "lucide-react";
import ProfileAvatar from "@/components/common/ProfileAvatar";
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
    lastMessage:
      "Please review the CSE-3101 complexity analysis slides before the next session.",
    lastTime: "10:14 AM",
    messages: [
      {
        id: "m1",
        sender: "them",
        text: "Good morning Sakib. Did you check the feedback on your dynamic programming problem set?",
        time: "10:05 AM",
      },
      {
        id: "m2",
        sender: "me",
        text: "Yes sir! I updated the recurrence tree and pushed it to the repository.",
        time: "10:10 AM",
      },
      {
        id: "m3",
        sender: "them",
        text: "Please review the CSE-3101 complexity analysis slides before the next session.",
        time: "10:14 AM",
      },
    ],
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
      {
        id: "c1",
        sender: "them",
        text: "Hey everyone, don't forget mid-term exam registration deadline this Thursday!",
        time: "09:30 AM",
      },
      {
        id: "c2",
        sender: "me",
        text: "Already submitted and cleared from accounts.",
        time: "09:38 AM",
      },
      {
        id: "c3",
        sender: "them",
        text: "Has anyone verified the AI lab dataset format?",
        time: "09:45 AM",
      },
    ],
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
      {
        id: "r1",
        sender: "them",
        text: "Your clearance for 6th Semester courses is active. Hall ticket will generate automatically.",
        time: "Yesterday",
      },
    ],
  },
];

const TEACHER_CONVERSATIONS: Conversation[] = [
  {
    id: "t-conv-1",
    name: "Sakib Ahmed",
    role: "Student (211-15-4424) • Sec-A",
    avatar: "",
    isOnline: true,
    unreadCount: 1,
    lastMessage:
      "Sir, can I visit Room 508 during today's 04:15 PM - 05:30 PM consultation hour?",
    lastTime: "11:20 AM",
    messages: [
      {
        id: "tm1",
        sender: "them",
        text: "Sir, can I visit Room 508 during today's 04:15 PM - 05:30 PM consultation hour?",
        time: "11:20 AM",
      },
    ],
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
      {
        id: "ta1",
        sender: "them",
        text: "Submitted the capstone project proposal draft to your email.",
        time: "09:00 AM",
      },
      {
        id: "ta2",
        sender: "me",
        text: "Approved the methodology section. Proceed with dataset collection.",
        time: "09:12 AM",
      },
      {
        id: "ta3",
        sender: "them",
        text: "Thank you for the guidance on capstone proposal sir!",
        time: "09:15 AM",
      },
    ],
  },
  {
    id: "t-conv-3",
    name: "Prof. Dr. M. Lutfar Rahman",
    role: "Head of Department • CSE",
    avatar: "",
    isOnline: false,
    unreadCount: 0,
    lastMessage: "Please verify CSE-3101 midterm grade submission by Friday.",
    lastTime: "Yesterday",
    messages: [
      {
        id: "td1",
        sender: "them",
        text: "Please verify CSE-3101 midterm grade submission by Friday.",
        time: "Yesterday",
      },
    ],
  },
];

interface MessagingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialPeerName?: string | null;
}

export function MessagingDrawer({
  isOpen,
  onClose,
  initialPeerName,
}: MessagingDrawerProps) {
  const { currentUser } = useAdminAuth();
  const isTeacher = currentUser?.role === "teacher";
  const baseConversations = isTeacher
    ? TEACHER_CONVERSATIONS
    : STUDENT_CONVERSATIONS;

  const resolveInitialId = (peerName?: string | null) => {
    if (peerName) {
      const match = baseConversations.find(
        (c) => c.name.toLowerCase() === peerName.toLowerCase()
      );
      if (match) return match.id;
    }
    return baseConversations[0]?.id ?? "";
  };

  const [conversations, setConversations] =
    useState<Conversation[]>(baseConversations);
  const [activeConvId, setActiveConvId] = useState<string>(
    resolveInitialId(initialPeerName)
  );
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileThreadOpen, setIsMobileThreadOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv =
    conversations.find((c) => c.id === activeConvId) || conversations[0];

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
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== activeConv.id) return conv;
        return {
          ...conv,
          lastMessage: newMsg.text,
          lastTime: newMsg.time,
          unreadCount: 0,
          messages: [...conv.messages, newMsg],
        };
      })
    );

    setInputText("");

    // Simulate auto-reply after 1.5s
    setTimeout(() => {
      const replyMsg: MessageItem = {
        id: `reply-${Date.now()}`,
        sender: "them",
        text: isTeacher
          ? "Acknowledged sir, thank you!"
          : "Noted Sakib. We will discuss this during today's 04:15 PM - 05:30 PM consultation hour in Room 508.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id !== activeConv.id) return conv;
          return {
            ...conv,
            lastMessage: replyMsg.text,
            lastTime: replyMsg.time,
            messages: [...conv.messages, replyMsg],
          };
        })
      );
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

  const filteredConversations = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/45 dark:bg-black/70 flex justify-end"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Campus Messenger"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl h-full bg-surface border-l border-line shadow-lg flex flex-col md:flex-row min-h-0"
      >
        {/* Left Side: Conversation Contacts List */}
        <div
          className={`w-full md:w-72 border-r border-line flex-col h-full min-h-0 bg-canvas shrink-0 ${
            isMobileThreadOpen ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-line flex items-center justify-between bg-surface">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-[15px] text-fg">Messages</h3>
                <p className="text-xs text-fg-muted">Direct academic chat</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] text-fg-muted hover:text-fg rounded-xl hover:bg-surface-2 flex items-center justify-center transition-colors cursor-pointer"
              title="Close messenger"
              aria-label="Close messenger"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Contacts */}
          <div className="p-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats, faculty..."
                aria-label="Search chats, faculty"
                className="w-full pl-9 pr-3 py-2 text-sm bg-surface border border-line rounded-xl text-fg placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConv?.id;
              return (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => {
                    setActiveConvId(conv.id);
                    setIsMobileThreadOpen(true);
                    setConversations((prev) =>
                      prev.map((c) =>
                        c.id === conv.id ? { ...c, unreadCount: 0 } : c
                      )
                    );
                  }}
                  className={`w-full p-3 rounded-xl text-left transition-colors flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? "bg-surface border border-line"
                      : "hover:bg-surface-2"
                  }`}
                >
                  <div className="relative shrink-0">
                    <ProfileAvatar size="md" alt={conv.name} />
                    {conv.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full ring-2 ring-surface" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p
                        className={`font-semibold text-sm truncate ${
                          isSelected ? "text-brand" : "text-fg"
                        }`}
                      >
                        {conv.name}
                      </p>
                      <span className="text-xs text-fg-muted shrink-0">
                        {conv.lastTime}
                      </span>
                    </div>
                    <p className="text-xs text-fg-muted truncate mb-0.5">
                      {conv.role}
                    </p>
                    <p className="text-xs text-fg-muted truncate">
                      {conv.lastMessage}
                    </p>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-brand text-on-brand text-[12px] font-semibold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Chat Thread */}
        <div
          className={`flex-1 flex-col h-full min-h-0 bg-surface ${
            isMobileThreadOpen ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Thread Header */}
          {activeConv ? (
            <div className="p-4 border-b border-line flex items-center justify-between bg-surface">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setIsMobileThreadOpen(false)}
                  className="md:hidden min-w-[44px] min-h-[44px] -ml-2 text-fg-muted hover:text-fg rounded-xl hover:bg-surface-2 flex items-center justify-center cursor-pointer"
                  title="Back to conversations"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div className="relative shrink-0">
                  <ProfileAvatar size="sm" alt={activeConv.name} />
                  {activeConv.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full ring-2 ring-surface" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm text-fg truncate">
                      {activeConv.name}
                    </h4>
                    {activeConv.isOnline && (
                      <span className="text-xs font-medium text-success shrink-0">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-fg-muted truncate">
                    {activeConv.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Link
                  href="/messages"
                  onClick={onClose}
                  title="Open full-page messenger"
                  aria-label="Open full-page messenger"
                  className="min-w-[44px] min-h-[44px] text-fg-muted hover:text-brand rounded-xl hover:bg-surface-2 flex items-center justify-center transition-colors"
                >
                  <Maximize2 className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={onClose}
                  title="Close messenger"
                  aria-label="Close messenger"
                  className="min-w-[44px] min-h-[44px] text-fg-muted hover:text-fg rounded-xl hover:bg-surface-2 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : null}

          {/* Message Bubbles Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-canvas/40">
            {activeConv?.messages.map((msg) => {
              const isMe = msg.sender === "me";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isMe ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      isMe
                        ? "bg-brand text-on-brand rounded-br-xs"
                        : "bg-surface-2 border border-line text-fg rounded-bl-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-xs text-fg-muted mt-1 px-1">
                    {msg.time}
                    {isMe ? " • Delivered" : ""}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Composer Input Area */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-line flex items-center gap-2 bg-surface"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${activeConv?.name ?? ""}...`}
              className="flex-1 min-h-[44px] px-3.5 py-2 text-sm bg-surface-2 border border-line rounded-xl text-fg placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover text-on-brand text-sm font-medium flex items-center gap-1.5 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
