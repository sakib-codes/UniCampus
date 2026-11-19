"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  Send, 
  Search, 
  CheckCheck, 
  Paperclip, 
  MessageSquare,
  Mail, 
  ArrowLeft, 
  Calendar, 
  Lock,
  Phone,
  Video,
  Info,
  Smile,
  Mic,
  MicOff,
  MoreHorizontal,
  Bell,
  BellOff,
  User,
  FileText,
  ChevronDown,
  ChevronRight,
  Download,
  ShieldCheck,
  X,
  PhoneOff,
  VideoOff,
  Plus,
  SquarePen,
  Pin,
  Reply,
  Play,
  Pause,
  Monitor,
  Maximize2,
  Edit3,
  Check
} from "lucide-react";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import { useAdminAuth } from "@/context/AdminAuthContext";

export type MessengerTheme = "classic" | "violet" | "sunset" | "emerald";

export interface MessageReaction {
  emoji: string;
  count: number;
  reactedByMe?: boolean;
}

export interface SharedFile {
  id: string;
  name: string;
  size: string;
  date: string;
  type: "pdf" | "image" | "doc";
}

export interface MessageItem {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
  status?: "sent" | "delivered" | "seen";
  reactions?: MessageReaction[];
  isThumbsUp?: boolean;
  thumbsUpEmoji?: string;
  replyTo?: { id: string; text: string; sender: string };
  isVoiceNote?: boolean;
  voiceDuration?: string;
  imageAttachment?: string;
}

export interface Conversation {
  id: string;
  name: string;
  role: string;
  category: "faculty" | "peers" | "office";
  avatar: string;
  isOnline: boolean;
  lastActive: string;
  userNote?: string;
  unreadCount: number;
  lastMessage: string;
  lastTime: string;
  consultationHours?: string;
  cabin?: string;
  email?: string;
  themeColor: MessengerTheme;
  quickEmoji: string;
  nickname?: string;
  isMuted?: boolean;
  pinnedMessageId?: string;
  messages: MessageItem[];
  sharedFiles?: SharedFile[];
  sharedPhotos?: string[];
}

const THEME_GRADIENTS: Record<MessengerTheme, { bubble: string; ring: string; label: string }> = {
  classic: {
    bubble: "bg-brand text-white",
    ring: "from-brand to-brand",
    label: "Brand Indigo"
  },
  violet: {
    bubble: "bg-gradient-to-r from-[var(--color-brand, #605BFF)] via-[#7B3FE4] to-[#B339E0] text-white",
    ring: "from-[var(--color-brand, #605BFF)] to-[#B339E0]",
    label: "Cyber Violet"
  },
  sunset: {
    bubble: "bg-gradient-to-r from-[#FF5E62] via-[#FF758C] to-[#FF9966] text-white",
    ring: "from-[#FF5E62] to-[#FF9966]",
    label: "Sunset Flare"
  },
  emerald: {
    bubble: "bg-gradient-to-r from-[#059669] via-[#10B981] to-[#34D399] text-white",
    ring: "from-[#059669] to-[#34D399]",
    label: "Emerald Campus"
  }
};

const EMOJI_REACTIONS_LIST = ["❤️", "👍", "😆", "😮", "😢", "🔥"];

// Audio chime generator via Web Audio API (zero external assets needed)
const playMessengerChime = (type: "pop" | "ding") => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === "pop") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.08);
    } else {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.2);
    }
  } catch {
    // Ignore audio restrictions
  }
};

const INITIAL_STUDENT_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    name: "Dr. Asif Rahman",
    role: "Associate Professor • CSE Advisor",
    category: "faculty",
    avatar: "",
    isOnline: true,
    lastActive: "Active now",
    userNote: "In Cabin 408 ☕",
    unreadCount: 1,
    consultationHours: "Sun & Tue: 2:00 PM – 4:00 PM",
    cabin: "Academic Building 2, Room 408",
    email: "asif.rahman@unicampus.edu",
    themeColor: "classic",
    quickEmoji: "👍",
    nickname: "Advisor Dr. Asif",
    isMuted: false,
    pinnedMessageId: "m3",
    lastMessage: "Please review the 3NF decomposition slides before the next session.",
    lastTime: "10:14 AM",
    sharedFiles: [
      { id: "f1", name: "CSE311_3NF_Decomposition.pdf", size: "2.4 MB", date: "Oct 19", type: "pdf" },
      { id: "f2", name: "Relational_Algebra_Notes.pdf", size: "1.1 MB", date: "Oct 15", type: "pdf" },
      { id: "f3", name: "Midterm_Consultation_Slots.pdf", size: "640 KB", date: "Oct 10", type: "pdf" }
    ],
    sharedPhotos: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&auto=format&fit=crop&q=80"
    ],
    messages: [
      { 
        id: "m1", 
        sender: "them", 
        text: "Good morning Sakib. Did you check the feedback on your relational algebra problem set?", 
        time: "10:05 AM" 
      },
      { 
        id: "m2", 
        sender: "me", 
        text: "Yes sir! I updated the query tree and pushed it to the repository.", 
        time: "10:10 AM",
        status: "seen",
        reactions: [{ emoji: "👍", count: 1, reactedByMe: false }]
      },
      { 
        id: "m3", 
        sender: "them", 
        text: "Please review the 3NF decomposition slides before the next session.", 
        time: "10:14 AM",
        reactions: [{ emoji: "❤️", count: 1, reactedByMe: true }]
      }
    ]
  },
  {
    id: "conv-2",
    name: "CSE Batch '26 Cohort",
    role: "6th Semester Study Group • 42 Members",
    category: "peers",
    avatar: "",
    isOnline: true,
    lastActive: "Active now",
    userNote: "Lab deadline tonight! ⚡",
    unreadCount: 3,
    themeColor: "violet",
    quickEmoji: "🔥",
    isMuted: false,
    lastMessage: "Has anyone verified the AI lab dataset format?",
    lastTime: "09:45 AM",
    sharedFiles: [
      { id: "f4", name: "AI_Lab_Dataset_Sample.csv", size: "4.8 MB", date: "Yesterday", type: "doc" },
      { id: "f5", name: "Midterm_Study_Guide_Batch26.pdf", size: "3.2 MB", date: "Oct 18", type: "pdf" }
    ],
    sharedPhotos: [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&auto=format&fit=crop&q=80"
    ],
    messages: [
      { id: "c1", sender: "them", text: "Hey everyone, don't forget mid-term exam registration deadline this Thursday!", time: "09:30 AM" },
      { id: "c2", sender: "me", text: "Already submitted and cleared from accounts ledger.", time: "09:38 AM", status: "seen" },
      { id: "c3", sender: "them", text: "Has anyone verified the AI lab dataset format?", time: "09:45 AM" }
    ]
  },
  {
    id: "conv-3",
    name: "Dr. Nadia Sultana",
    role: "Professor • Algorithms & Data Structures",
    category: "faculty",
    avatar: "",
    isOnline: true,
    lastActive: "Active now",
    userNote: "Researching DP 📚",
    unreadCount: 0,
    consultationHours: "Mon & Wed: 10:00 AM – 12:00 PM",
    cabin: "Science Complex, Room 312",
    email: "nadia.sultana@unicampus.edu",
    themeColor: "emerald",
    quickEmoji: "💡",
    isMuted: false,
    lastMessage: "Great job on the Dynamic Programming benchmark test.",
    lastTime: "Yesterday",
    sharedFiles: [
      { id: "f6", name: "DP_Optimization_Matrix.pdf", size: "1.9 MB", date: "Oct 16", type: "pdf" }
    ],
    messages: [
      { id: "n1", sender: "me", text: "Hello Ma'am, I submitted the Floyd-Warshall analysis report.", time: "Yesterday", status: "seen" },
      { id: "n2", sender: "them", text: "Great job on the Dynamic Programming benchmark test. The complexity proofs were very rigorous.", time: "Yesterday", reactions: [{ emoji: "❤️", count: 1, reactedByMe: true }] }
    ]
  },
  {
    id: "conv-4",
    name: "Registrar Helpdesk",
    role: "Academic Affairs & Clearances",
    category: "office",
    avatar: "",
    isOnline: false,
    lastActive: "Active 2h ago",
    unreadCount: 0,
    cabin: "Admin Central, Ground Floor Window 4",
    email: "registrar.help@unicampus.edu",
    themeColor: "classic",
    quickEmoji: "👍",
    isMuted: false,
    lastMessage: "Your clearance for 6th Semester courses is active.",
    lastTime: "Oct 19",
    sharedFiles: [
      { id: "f7", name: "Admit_Card_Fall2026.pdf", size: "420 KB", date: "Oct 19", type: "pdf" }
    ],
    messages: [
      { id: "r1", sender: "them", text: "Your clearance for 6th Semester courses is active. Hall ticket will generate automatically on the portal.", time: "Oct 19" }
    ]
  },
  {
    id: "conv-5",
    name: "Prof. Jamal Uddin",
    role: "Head of Dept • Electrical Engineering",
    category: "faculty",
    avatar: "",
    isOnline: false,
    lastActive: "Active 4h ago",
    unreadCount: 0,
    consultationHours: "Mon & Wed: 11:00 AM – 1:00 PM",
    cabin: "Engineering Tower, Room 214",
    email: "jamal.eee@unicampus.edu",
    themeColor: "sunset",
    quickEmoji: "👍",
    isMuted: false,
    lastMessage: "Lab reports have been evaluated and synced.",
    lastTime: "Oct 18",
    messages: [
      { id: "j1", sender: "them", text: "Lab reports for Digital Signal Processing have been evaluated and synced to the portal ledger.", time: "Oct 18" }
    ]
  }
];

const INITIAL_TEACHER_CONVERSATIONS: Conversation[] = [
  {
    id: "t-conv-1",
    name: "Sakib Ahmed",
    role: "Student (211-15-4424) • 6th Sem CSE",
    category: "peers",
    avatar: "",
    isOnline: true,
    lastActive: "Active now",
    userNote: "Working on DB schema 💻",
    unreadCount: 1,
    email: "sakib.cse@unicampus.edu",
    themeColor: "classic",
    quickEmoji: "👍",
    nickname: "Sakib (211-15-4424)",
    isMuted: false,
    lastMessage: "Sir, can I visit your cabin during today's 2 PM consultation hour?",
    lastTime: "11:20 AM",
    sharedFiles: [
      { id: "tf1", name: "Relational_Algebra_QueryTree.pdf", size: "1.4 MB", date: "Today", type: "pdf" }
    ],
    messages: [
      { id: "tm1", sender: "them", text: "Sir, can I visit your cabin during today's 2 PM consultation hour to discuss the 3NF assignment?", time: "11:20 AM" }
    ]
  },
  {
    id: "t-conv-2",
    name: "Anika Tabassum",
    role: "Student (211-15-4425) • Capstone Project Lead",
    category: "peers",
    avatar: "",
    isOnline: true,
    lastActive: "Active now",
    unreadCount: 0,
    email: "anika.cse@unicampus.edu",
    themeColor: "violet",
    quickEmoji: "👏",
    nickname: "Anika (Team Lead)",
    isMuted: false,
    lastMessage: "Thank you for the guidance on capstone proposal sir!",
    lastTime: "09:15 AM",
    sharedFiles: [
      { id: "tf2", name: "SmartCampus_Capstone_Proposal_Draft.pdf", size: "3.7 MB", date: "Yesterday", type: "pdf" }
    ],
    messages: [
      { id: "ta1", sender: "them", text: "Submitted the capstone project proposal draft to your portal inbox.", time: "09:00 AM" },
      { id: "ta2", sender: "me", text: "Approved the methodology section. Proceed with dataset collection.", time: "09:12 AM", status: "seen" },
      { id: "ta3", sender: "them", text: "Thank you for the guidance on capstone proposal sir!", time: "09:15 AM", reactions: [{ emoji: "❤️", count: 1, reactedByMe: true }] }
    ]
  },
  {
    id: "t-conv-3",
    name: "Dr. Shahriar Hossain",
    role: "Central Administration • Super Admin",
    category: "office",
    avatar: "",
    isOnline: false,
    lastActive: "Active 1h ago",
    unreadCount: 0,
    cabin: "Dean Office, Level 7",
    email: "admin@unicampus.edu",
    themeColor: "classic",
    quickEmoji: "👍",
    isMuted: false,
    lastMessage: "Please verify CSE-311 midterm grade submission by Friday.",
    lastTime: "Yesterday",
    messages: [
      { id: "td1", sender: "them", text: "Please verify CSE-311 midterm grade submission by Friday before senate publication.", time: "Yesterday" }
    ]
  }
];

export default function MessagesPage() {
  const { currentUser } = useAdminAuth();
  const isTeacher = currentUser?.role === "teacher";

  const [conversations, setConversations] = useState<Conversation[]>(
    isTeacher ? INITIAL_TEACHER_CONVERSATIONS : INITIAL_STUDENT_CONVERSATIONS
  );
  const [activeConvId, setActiveConvId] = useState<string>(
    isTeacher ? "t-conv-1" : "conv-1"
  );
  const [activeCategory, setActiveCategory] = useState<"all" | "faculty" | "peers" | "office">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [isMobileConversationOpen, setIsMobileConversationOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeReactionMessageId, setActiveReactionMessageId] = useState<string | null>(null);

  // Messenger Advanced States
  const [isTyping, setIsTyping] = useState(false);
  const [replyingToMessage, setReplyingToMessage] = useState<MessageItem | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // In-Chat Search
  const [isSearchInChatOpen, setIsSearchInChatOpen] = useState(false);
  const [inChatSearchTerm, setInChatSearchTerm] = useState("");

  // Notes Modal
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [userStatusNote, setUserStatusNote] = useState("Studying for Midterms 📚");

  // New Chat Modal
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  // Edit Nickname State
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");

  // Accordion states in details sidebar
  const [expandedSection, setExpandedSection] = useState<"info" | "customize" | "files" | "photos" | "privacy" | null>("info");

  // Call simulation states
  const [activeCallType, setActiveCallType] = useState<"audio" | "video" | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallMuted, setIsCallMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Quick Emoji Picker modal / dropdown
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Draggable panel resizer states
  const [leftPanelWidth, setLeftPanelWidth] = useState(350);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setConversations(isTeacher ? INITIAL_TEACHER_CONVERSATIONS : INITIAL_STUDENT_CONVERSATIONS);
    setActiveConvId(isTeacher ? "t-conv-1" : "conv-1");
  }, [isTeacher]);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];
  const activeTheme = THEME_GRADIENTS[activeConv?.themeColor || "classic"];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages, isTyping]);

  // Voice recording timer effect
  useEffect(() => {
    if (isRecordingVoice) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecordingVoice]);

  // Call timer effect
  useEffect(() => {
    if (activeCallType) {
      setCallDuration(0);
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [activeCallType]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSendMessage = (textToSend?: string, isThumbsUp: boolean = false, imageAttachment?: string, isVoiceNote: boolean = false, voiceDuration?: string) => {
    const text = isThumbsUp 
      ? activeConv.quickEmoji || "👍" 
      : isVoiceNote 
        ? "Voice Message" 
        : (textToSend || inputText).trim();

    if (!text && !imageAttachment && !isVoiceNote) return;
    if (!activeConv) return;

    playMessengerChime("pop");

    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      sender: "me",
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "delivered",
      isThumbsUp,
      thumbsUpEmoji: isThumbsUp ? text : undefined,
      replyTo: replyingToMessage ? {
        id: replyingToMessage.id,
        text: replyingToMessage.text,
        sender: replyingToMessage.sender === "me" ? "You" : (activeConv.nickname || activeConv.name)
      } : undefined,
      imageAttachment,
      isVoiceNote,
      voiceDuration
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id !== activeConv.id) return conv;
      return {
        ...conv,
        lastMessage: isThumbsUp 
          ? `Sent a reaction: ${text}` 
          : isVoiceNote 
            ? "🎤 Sent a voice message" 
            : imageAttachment 
              ? "📷 Sent a photo" 
              : newMsg.text,
        lastTime: newMsg.time,
        unreadCount: 0,
        messages: [...conv.messages, newMsg]
      };
    }));

    if (!textToSend && !isThumbsUp && !imageAttachment && !isVoiceNote) {
      setInputText("");
    }
    setReplyingToMessage(null);
    setIsRecordingVoice(false);

    // Live Messenger Typing indicator simulation
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      playMessengerChime("ding");

      const replyMsg: MessageItem = {
        id: `reply-${Date.now()}`,
        sender: "them",
        text: isThumbsUp
          ? "Received! Let me know if you need any further clarification."
          : isVoiceNote
            ? "I listened to your voice message regarding the query. The updated slides clarify the concept."
            : imageAttachment
              ? "The diagram looks clear and properly formatted. Proceed with your implementation."
              : isTeacher
                ? "Understood sir! I will attend the consultation on time."
                : `Thank you for reaching out. I have received your message: "${text.slice(0, 36)}...". I will review it shortly.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "seen"
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

  const handleSendVoiceNote = () => {
    const durationStr = `0:${recordingSeconds < 10 ? '0' : ''}${recordingSeconds || 4}`;
    handleSendMessage(undefined, false, undefined, true, durationStr);
  };

  const handleToggleReaction = (messageId: string, emoji: string) => {
    playMessengerChime("pop");
    setConversations(prev => prev.map(conv => {
      if (conv.id !== activeConv.id) return conv;
      return {
        ...conv,
        messages: conv.messages.map(msg => {
          if (msg.id !== messageId) return msg;
          const currentReactions = msg.reactions || [];
          const existing = currentReactions.find(r => r.emoji === emoji);

          let updatedReactions: MessageReaction[];
          if (existing) {
            if (existing.reactedByMe) {
              updatedReactions = currentReactions
                .map(r => r.emoji === emoji ? { ...r, count: r.count - 1, reactedByMe: false } : r)
                .filter(r => r.count > 0);
            } else {
              updatedReactions = currentReactions.map(r => 
                r.emoji === emoji ? { ...r, count: r.count + 1, reactedByMe: true } : r
              );
            }
          } else {
            updatedReactions = [...currentReactions, { emoji, count: 1, reactedByMe: true }];
          }

          return {
            ...msg,
            reactions: updatedReactions
          };
        })
      };
    }));
    setActiveReactionMessageId(null);
  };

  const handleTogglePinMessage = (messageId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id !== activeConv.id) return conv;
      const isPinned = conv.pinnedMessageId === messageId;
      return {
        ...conv,
        pinnedMessageId: isPinned ? undefined : messageId
      };
    }));
    setActiveReactionMessageId(null);
  };

  const handleChangeTheme = (theme: MessengerTheme) => {
    setConversations(prev => prev.map(c => c.id === activeConv.id ? { ...c, themeColor: theme } : c));
  };

  const handleChangeQuickEmoji = (emoji: string) => {
    setConversations(prev => prev.map(c => c.id === activeConv.id ? { ...c, quickEmoji: emoji } : c));
  };

  const handleToggleMute = () => {
    setConversations(prev => prev.map(c => c.id === activeConv.id ? { ...c, isMuted: !c.isMuted } : c));
  };

  const handleSaveNickname = () => {
    if (!nicknameInput.trim()) return;
    setConversations(prev => prev.map(c => c.id === activeConv.id ? { ...c, nickname: nicknameInput.trim() } : c));
    setIsEditingNickname(false);
  };

  // Resize handler for Column 1 (Left chats directory sidebar)
  const handleLeftResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingLeft(true);
    const startX = e.clientX;
    const startWidth = leftPanelWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const clamped = Math.min(Math.max(startWidth + delta, 260), 520);
      setLeftPanelWidth(clamped);
    };

    const onMouseUp = () => {
      setIsDraggingLeft(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // Resize handler for Column 3 (Right Details sidebar)
  const handleRightResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingRight(true);
    const startX = e.clientX;
    const startWidth = rightPanelWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = startX - moveEvent.clientX;
      const clamped = Math.min(Math.max(startWidth + delta, 260), 480);
      setRightPanelWidth(clamped);
    };

    const onMouseUp = () => {
      setIsDraggingRight(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          conv.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || conv.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const pinnedMessage = activeConv.messages.find(m => m.id === activeConv.pinnedMessageId);

  return (
    <div 
      style={{
        "--left-panel-width": `${leftPanelWidth}px`,
        "--right-panel-width": `${rightPanelWidth}px`,
      } as React.CSSProperties}
      className="h-full w-full flex min-h-0 overflow-hidden bg-white dark:bg-[#010409] font-sans antialiased select-text"
    >
      
      {/* ========================================================= */}
      {/* COLUMN 1: CHATS DIRECTORY (Messenger Sidebar)              */}
      {/* ========================================================= */}
      <aside className={`w-full md:w-[var(--left-panel-width)] border-r border-line bg-white dark:bg-surface flex flex-col shrink-0 ${
        isMobileConversationOpen ? "hidden md:flex" : "flex"
      }`}>
        
        {/* Messenger Header: Bold 'Chats' + Action icons */}
        <div className="p-3.5 pb-2 border-b border-slate-100 dark:border-line">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-fg">
                Chats
              </h1>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsNewChatModalOpen(true)}
                title="New Conversation"
                aria-label="New Conversation"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-surface-2 dark:hover:bg-surface-2 text-slate-700 dark:text-fg flex items-center justify-center transition-colors cursor-pointer"
              >
                <SquarePen className="w-4 h-4" />
              </button>
              <button 
                title="Chat Options"
                aria-label="Chat Options"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-surface-2 dark:hover:bg-surface-2 text-slate-700 dark:text-fg flex items-center justify-center transition-colors cursor-pointer"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Messenger Input */}
          <div className="relative mb-2.5">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-fg-muted" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Messenger"
              aria-label="Search Messenger"
              className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm rounded-full bg-slate-100 dark:bg-surface-2 border border-transparent focus:border-brand focus:ring-2 focus:ring-brand/40 text-slate-900 dark:text-fg placeholder:text-slate-400 dark:placeholder:text-fg-muted outline-none transition-colors"
            />
          </div>

          {/* Messenger Category Tabs */}
          <div role="tablist" aria-label="Chat categories" className="flex items-center gap-1.5 overflow-x-auto py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {[
              { id: "all", label: "Inbox" },
              { id: "faculty", label: "Faculty" },
              { id: "peers", label: "Study Groups" },
              { id: "office", label: "Offices" }
            ].map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeCategory === tab.id}
                onClick={() => setActiveCategory(tab.id as typeof activeCategory)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer whitespace-nowrap focus-visible:ring-2 focus-visible:ring-brand ${
                  activeCategory === tab.id
                    ? "bg-slate-900 text-white dark:bg-fg dark:text-[#010409] shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-surface-2 dark:hover:bg-surface-2 dark:text-fg-muted dark:hover:text-fg"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ACTIVE NOW CONTACT STORIES TRAY (Messenger Signature) */}
        <div className="px-3 pt-2 pb-2.5 border-b border-slate-100 dark:border-line bg-slate-50/50 dark:bg-surface/50">
          <div className="flex items-center justify-between mb-1 px-1">
            <span className="text-xs font-bold text-slate-500 dark:text-fg-muted uppercase tracking-wider">
              Active Now
            </span>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {conversations.filter(c => c.isOnline).length} Online
            </span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pt-2 pb-2 px-1 -mx-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* User's Note / Status */}
            <button 
              type="button"
              onClick={() => setIsNoteModalOpen(true)}
              className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group focus-visible:ring-2 focus-visible:ring-brand rounded-full"
              title="Leave a campus note"
              aria-label="Leave a campus note"
            >
              <div className="relative w-12 h-12 rounded-full border-2 border-dashed border-brand/50 dark:border-brand/40 flex items-center justify-center group-hover:border-brand transition-colors bg-white dark:bg-surface-2">
                <Plus className="w-5 h-5 text-brand group-hover:scale-110 transition-transform" />
                <span className="absolute -bottom-1 -right-0.5 w-4 h-4 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  +
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-600 dark:text-fg-muted max-w-[56px] truncate text-center">
                {userStatusNote ? userStatusNote.slice(0, 8) + ".." : "Your note"}
              </span>
            </button>

            {/* Active Online Contacts */}
            {conversations.filter(c => c.isOnline).map(c => {
              const cleanName = c.name.replace(/^(Dr\.|Prof\.|Engr\.|Ms\.|Mr\.)\s+/i, "");
              const shortLabel = cleanName.split(" ")[0] || c.name;
              const isSelected = c.id === activeConv.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveConvId(c.id);
                    setIsMobileConversationOpen(true);
                  }}
                  className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group focus-visible:ring-2 focus-visible:ring-brand rounded-full focus:outline-none"
                  title={`${c.name} • ${c.userNote || "Active now"}`}
                  aria-label={`${c.name} • ${c.userNote || "Active now"}`}
                >
                  <div className={`relative w-12 h-12 rounded-full p-0.5 transition-transform duration-150 group-hover:scale-105 ${
                    isSelected ? "ring-2 ring-brand" : "ring-1 ring-slate-200 dark:ring-border-line"
                  }`}>
                    <ProfileAvatar 
                      className="w-full h-full"
                      iconClassName="w-6 h-6"
                    />
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-surface absolute bottom-0 right-0 shadow-xs" />
                  </div>
                  <span className={`text-xs font-bold max-w-[58px] truncate text-center ${
                    isSelected ? "text-brand" : "text-slate-700 dark:text-fg"
                  }`}>
                    {shortLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversation Rows List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-10 h-10 text-slate-300 dark:text-border-line mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-500 dark:text-fg-muted">No chats match your search.</p>
            </div>
          ) : (
            filteredConversations.map(conv => {
              const isSelected = conv.id === activeConv.id;
              const isCurrentTyping = isSelected && isTyping;

              return (
                <div
                  key={conv.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open conversation with ${conv.nickname || conv.name}`}
                  onClick={() => {
                    setActiveConvId(conv.id);
                    setIsMobileConversationOpen(true);
                    setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveConvId(conv.id);
                      setIsMobileConversationOpen(true);
                      setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c));
                    }
                  }}
                  className={`group relative w-full p-2.5 rounded-2xl flex items-center gap-3 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none ${
                    isSelected
                      ? "bg-slate-100 dark:bg-surface-2"
                      : "hover:bg-slate-50 dark:hover:bg-surface-2/60"
                  }`}
                >
                  {/* Avatar with Messenger Active Dot & Note Bubble */}
                  <div className="relative shrink-0">
                    <ProfileAvatar 
                      className="w-13 h-13 border border-slate-200/80 dark:border-line"
                      iconClassName="w-6 h-6"
                    />
                    {conv.isOnline && (
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-surface absolute bottom-0 right-0 shadow-xs" />
                    )}
                  </div>

                  {/* Metadata & Message Preview */}
                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className={`text-sm truncate ${
                        conv.unreadCount > 0 ? "font-black text-slate-900 dark:text-white" : "font-semibold text-slate-800 dark:text-fg"
                      }`}>
                        {conv.nickname || conv.name}
                      </h3>
                      <span className="text-xs text-slate-400 dark:text-fg-muted shrink-0 font-medium">
                        {conv.lastTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      {isCurrentTyping ? (
                        <p className="text-xs text-brand font-medium italic flex items-center gap-1 truncate">
                          <span>Typing</span>
                          <span className="inline-flex gap-0.5">
                            <span className="w-1 h-1 rounded-full bg-brand animate-bounce" />
                            <span className="w-1 h-1 rounded-full bg-brand animate-bounce [animation-delay:150ms]" />
                            <span className="w-1 h-1 rounded-full bg-brand animate-bounce [animation-delay:300ms]" />
                          </span>
                        </p>
                      ) : (
                        <p className={`text-xs truncate ${
                          conv.unreadCount > 0 
                            ? "font-bold text-slate-900 dark:text-fg" 
                            : "text-slate-500 dark:text-fg-muted"
                        }`}>
                          {conv.lastMessage}
                        </p>
                      )}

                      {conv.unreadCount > 0 && (
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-[#0084FF] shrink-0 shadow-xs" />
                      )}
                    </div>
                  </div>

                  {/* Quick Action Button on Hover (Messenger Style) */}
                  <div className="hidden group-hover:flex items-center gap-1 absolute right-2.5 bg-slate-100/90 dark:bg-surface-2/90 backdrop-blur-xs px-1 py-0.5 rounded-full shadow-xs">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleMute();
                      }}
                      className="p-1 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white"
                      title={conv.isMuted ? "Unmute" : "Mute"}
                      aria-label={conv.isMuted ? "Unmute notifications" : "Mute notifications"}
                    >
                      {conv.isMuted ? <BellOff className="w-3.5 h-3.5 text-amber-500" /> : <Bell className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* Resizer Handle: Column 1 <-> Column 2 (Desktop) */}
      <div
        role="separator"
        tabIndex={0}
        aria-orientation="vertical"
        aria-valuenow={leftPanelWidth}
        aria-valuemin={260}
        aria-valuemax={520}
        aria-label="Resize conversation directory"
        onMouseDown={handleLeftResizeStart}
        onDoubleClick={() => setLeftPanelWidth(350)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            setLeftPanelWidth(prev => Math.max(prev - 10, 260));
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            setLeftPanelWidth(prev => Math.min(prev + 10, 520));
          }
        }}
        title="Drag to resize panel (Double-click to reset)"
        className={`hidden md:flex w-2 -mx-1 shrink-0 cursor-col-resize group relative items-center justify-center transition-colors select-none z-20 outline-none focus-visible:bg-brand/20 ${
          isDraggingLeft ? "bg-brand/30" : "hover:bg-brand/20"
        }`}
      >
        <div className={`w-0.5 h-8 rounded-full transition-colors ${
          isDraggingLeft ? "bg-brand" : "bg-slate-300 dark:bg-border-line group-hover:bg-brand"
        }`} />
      </div>

      {/* ========================================================= */}
      {/* COLUMN 2: MESSENGER CHAT STREAM (Center Window)           */}
      {/* ========================================================= */}
      <main className={`flex-1 flex flex-col min-w-0 bg-white dark:bg-[#010409] ${
        !isMobileConversationOpen ? "hidden md:flex" : "flex"
      }`}>
        
        {/* Messenger Chat Header */}
        <div className={`h-16 px-4 border-b border-line bg-white dark:bg-surface flex items-center justify-between shrink-0 shadow-2xs z-10`}>
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsMobileConversationOpen(false)}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-surface-2 md:hidden cursor-pointer"
              title="Back to conversation list"
              aria-label="Back to conversation list"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="relative shrink-0">
              <ProfileAvatar 
                size="md"
                className="border border-slate-200 dark:border-line"
              />
              {activeConv.isOnline && (
                <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-surface absolute bottom-0 right-0 shadow-xs" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-fg truncate">
                  {activeConv.nickname || activeConv.name}
                </h2>
                {activeConv.isMuted && (
                  <BellOff className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-fg-muted flex items-center gap-1.5 truncate">
                <span className={`w-1.5 h-1.5 rounded-full ${activeConv.isOnline ? "bg-emerald-500" : "bg-slate-400"}`} />
                <span>{activeConv.lastActive}</span>
                <span>•</span>
                <span className="truncate">{activeConv.role}</span>
              </p>
            </div>
          </div>

          {/* Action Icons: In-chat Search, Audio Call, Video Call, Details Toggle */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={() => setIsSearchInChatOpen(!isSearchInChatOpen)}
              className={`p-2.5 rounded-full transition-colors cursor-pointer ${
                isSearchInChatOpen ? "bg-brand/10 text-brand" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-surface-2"
              }`}
              title="Search in conversation"
              aria-label="Search in conversation"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveCallType("audio")}
              className="p-2.5 rounded-full text-brand hover:bg-brand/10 dark:hover:bg-brand/15 transition-colors cursor-pointer"
              title="Start voice call"
              aria-label="Start voice call"
            >
              <Phone className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveCallType("video")}
              className="p-2.5 rounded-full text-brand hover:bg-brand/10 dark:hover:bg-brand/15 transition-colors cursor-pointer"
              title="Start video call"
              aria-label="Start video call"
            >
              <Video className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsDetailsOpen(!isDetailsOpen)}
              className={`p-2.5 rounded-full transition-colors cursor-pointer ${
                isDetailsOpen 
                  ? "bg-brand/10 text-brand dark:bg-brand/20" 
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-surface-2"
              }`}
              title="Conversation information"
              aria-label="Conversation information"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* IN-CHAT SEARCH BAR (Messenger feature) */}
        {isSearchInChatOpen && (
          <div className="px-4 py-2 bg-slate-50 dark:bg-surface-2 border-b border-slate-200 dark:border-line flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 dark:text-fg-muted shrink-0" />
            <input 
              type="text"
              value={inChatSearchTerm}
              onChange={(e) => setInChatSearchTerm(e.target.value)}
              placeholder="Search in this conversation..."
              aria-label="Search in this conversation"
              className="flex-1 text-xs bg-transparent text-slate-900 dark:text-fg outline-none focus:ring-1 focus:ring-brand rounded px-1"
              autoFocus
            />
            {inChatSearchTerm && (
              <span className="text-xs text-slate-400 dark:text-fg-muted font-mono">
                {activeConv.messages.filter(m => m.text.toLowerCase().includes(inChatSearchTerm.toLowerCase())).length} matches
              </span>
            )}
            <button 
              onClick={() => {
                setIsSearchInChatOpen(false);
                setInChatSearchTerm("");
              }}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              title="Close search"
              aria-label="Close search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* PINNED MESSAGE BANNER (Messenger Signature) */}
        {pinnedMessage && (
          <div className="px-4 py-2 bg-indigo-50/80 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between gap-3 text-xs text-indigo-950 dark:text-indigo-200 shrink-0">
            <div className="flex items-center gap-2 truncate">
              <Pin className="w-3.5 h-3.5 text-brand shrink-0" />
              <span className="font-bold text-xs text-brand shrink-0 uppercase tracking-wider">Pinned:</span>
              <span className="truncate font-medium">{pinnedMessage.text}</span>
            </div>
            <button 
              onClick={() => handleTogglePinMessage(pinnedMessage.id)}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold shrink-0 cursor-pointer"
            >
              Unpin
            </button>
          </div>
        )}

        {/* Message History Canvas */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 [scrollbar-gutter:stable]">

          {/* Message Stream or Empty State */}
          {activeConv.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-14 h-14 rounded-full bg-brand/10 text-brand flex items-center justify-center mb-3">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-fg">
                Start the conversation
              </h4>
              <p className={`text-xs text-fg-muted max-w-xs mt-1`}>
                Send a message, voice note, or shared file to begin collaborating with {activeConv.name}.
              </p>
            </div>
          ) : (
            <>
              {/* Date Separator */}
              <div className="flex items-center justify-center my-3">
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-surface-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-fg-muted">
                  Today
                </span>
              </div>

              {/* Message Bubbles Stream */}
              {activeConv.messages.map((msg, index) => {
                const isMe = msg.sender === "me";
                const isLastSent = isMe && index === activeConv.messages.length - 1;
                const isHighlighted = inChatSearchTerm && msg.text.toLowerCase().includes(inChatSearchTerm.toLowerCase());

                return (
                  <div 
                    key={msg.id}
                    onMouseEnter={() => setActiveReactionMessageId(msg.id)}
                    onMouseLeave={() => setActiveReactionMessageId(null)}
                    className={`relative group flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"} ${
                      isHighlighted ? "bg-amber-500/10 p-1 rounded-xl" : ""
                    }`}
                  >
                    {/* Contact Avatar for Incoming Messages */}
                    {!isMe && (
                      <ProfileAvatar 
                        className="w-7 h-7 border border-slate-200 dark:border-line mb-1"
                        iconClassName="w-3.5 h-3.5"
                      />
                    )}

                    {/* Floating Reaction Bar + Reply + Pin Actions (Messenger Style) */}
                    {activeReactionMessageId === msg.id && (
                      <div className={`absolute -top-9 z-20 flex items-center gap-1 px-2 py-1 rounded-full bg-white dark:bg-surface-2 border border-slate-200 dark:border-line shadow-lg  ${
                        isMe ? "right-0" : "left-9"
                      }`}>
                        {EMOJI_REACTIONS_LIST.map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => handleToggleReaction(msg.id, emoji)}
                            className="hover:scale-130 transition-transform p-0.5 text-sm cursor-pointer"
                            title={`React ${emoji}`}
                            aria-label={`React with ${emoji}`}
                          >
                            {emoji}
                          </button>
                        ))}
                        
                        <span className="w-px h-3.5 bg-slate-200 dark:bg-border-line mx-0.5" />

                        <button
                          onClick={() => setReplyingToMessage(msg)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-surface-2 rounded-full text-slate-500 hover:text-brand cursor-pointer"
                          title="Reply"
                          aria-label="Reply to message"
                        >
                          <Reply className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleTogglePinMessage(msg.id)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-surface-2 rounded-full text-slate-500 hover:text-amber-500 cursor-pointer"
                          title="Pin message"
                          aria-label="Pin message"
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                {/* Message Bubble Container */}
                <div className={`relative max-w-[82%] sm:max-w-md ${isMe ? "items-end" : "items-start"}`}>
                  
                  {/* Quoted Message Preview if replying */}
                  {msg.replyTo && (
                    <div className={`text-xs mb-1 px-3 py-1.5 rounded-xl border flex items-center gap-2 opacity-85 truncate ${
                      isMe 
                        ? "bg-slate-200/50 dark:bg-white/10 border-white/20 text-slate-900 dark:text-white" 
                        : "bg-slate-200/50 dark:bg-surface-2 border-slate-300 dark:border-line text-slate-700 dark:text-fg-muted"
                    }`}>
                      <Reply className="w-3 h-3 shrink-0 rotate-180" />
                      <span className="font-bold shrink-0">{msg.replyTo.sender}:</span>
                      <span className="truncate italic">{msg.replyTo.text}</span>
                    </div>
                  )}

                  {/* Bubble Content: Image Attachment */}
                  {msg.imageAttachment && (
                    <div 
                      onClick={() => setLightboxImage(msg.imageAttachment || null)}
                      className="relative w-64 h-48 rounded-2xl overflow-hidden mb-1.5 cursor-pointer border border-slate-200 dark:border-line group/img shadow-sm"
                    >
                      <Image 
                        src={msg.imageAttachment} 
                        alt="Attached media" 
                        fill 
                        sizes="256px" 
                        className="object-cover group-hover/img:scale-105 transition-transform duration-200" 
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-center justify-center">
                        <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover/img:opacity-100 transition-opacity drop-shadow-md" />
                      </div>
                    </div>
                  )}

                  {/* Bubble Content: Voice Note */}
                  {msg.isVoiceNote ? (
                    <div className={`px-4 py-3 rounded-[20px] shadow-2xs flex items-center gap-3 ${
                      isMe 
                        ? `${activeTheme.bubble} rounded-br-[4px]` 
                        : "bg-slate-100 dark:bg-surface-2 text-slate-900 dark:text-fg rounded-bl-[4px] border border-slate-200/50 dark:border-line"
                    }`}>
                      <button 
                        onClick={() => setPlayingVoiceId(playingVoiceId === msg.id ? null : msg.id)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105 ${
                          isMe ? "bg-white text-brand" : "bg-brand text-white"
                        }`}
                      >
                        {playingVoiceId === msg.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>

                      {/* Animated Sound Waveform Bars */}
                      <div className="flex items-center gap-0.5 h-6">
                        {[40, 75, 100, 60, 85, 30, 90, 50, 70, 45, 95, 65, 35, 80, 50].map((h, i) => (
                          <span 
                            key={i} 
                            className={`w-1 rounded-full transition-all duration-150 ${
                              playingVoiceId === msg.id ? "animate-pulse" : ""
                            } ${isMe ? "bg-white/80" : "bg-slate-400 dark:bg-slate-500"}`}
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>

                      <span className="text-xs font-mono font-bold shrink-0 opacity-90">
                        {msg.voiceDuration || "0:14"}
                      </span>
                    </div>
                  ) : msg.isThumbsUp ? (
                    /* Bubble Content: Big Messenger Thumbs Up / Sticker */
                    <div className="p-2 cursor-pointer hover:scale-110 active:scale-95 transition-transform">
                      <span className="text-5xl leading-none">
                        {msg.thumbsUpEmoji || activeConv.quickEmoji || "👍"}
                      </span>
                    </div>
                  ) : (
                    /* Bubble Content: Regular Message Text */
                    <div className={`px-4 py-2.5 text-sm leading-relaxed shadow-2xs font-normal ${
                      isMe 
                        ? "bg-brand text-white rounded-[20px] rounded-br-[4px]"
                        : "bg-surface-2 text-fg rounded-[20px] rounded-bl-[4px] border border-line"
                    }`}>
                      {msg.text}
                    </div>
                  )}

                  {/* Attached Emoji Reactions Badge */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className={`absolute -bottom-2.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-white dark:bg-surface-2 border border-slate-200 dark:border-line shadow-xs text-xs ${
                      isMe ? "right-1" : "left-1"
                    }`}>
                      {msg.reactions.map((r, i) => (
                        <span key={i} className="flex items-center gap-0.5 font-bold">
                          <span>{r.emoji}</span>
                          {r.count > 1 && <span className="text-xs text-slate-500 dark:text-fg-muted">{r.count}</span>}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Message Time & Messenger 'Seen' Mini Avatar status */}
                  <div className={`flex items-center gap-1.5 mt-1 px-1 text-xs text-slate-400 dark:text-fg-muted ${
                    isMe ? "justify-end" : "justify-start"
                  }`}>
                    <span>{msg.time}</span>
                    {isMe && (
                      isLastSent ? (
                        /* Messenger Iconic Mini Seen Avatar Indicator */
                        <ProfileAvatar 
                          className="w-3.5 h-3.5 border border-white dark:border-surface shrink-0"
                          iconClassName="w-2 h-2"
                        />
                      ) : (
                        <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          </>
          )}

          {/* MESSENGER LIVE TYPING INDICATOR (3 jumping dots bubble) */}
          {isTyping && (
            <div className="flex items-end gap-2">
              <ProfileAvatar 
                className="w-7 h-7 border border-slate-200 dark:border-line mb-1"
                iconClassName="w-3.5 h-3.5"
              />

              <div className="px-4 py-3 rounded-[20px] rounded-bl-[4px] bg-slate-100 dark:bg-surface-2 flex items-center gap-1.5 shadow-2xs border border-slate-200/50 dark:border-line">
                <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Replying To Quote Bar (if active) */}
        {replyingToMessage && (
          <div className="px-4 py-2 bg-slate-100 dark:bg-surface-2 border-t border-slate-200 dark:border-line flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <Reply className="w-3.5 h-3.5 text-brand shrink-0 rotate-180" />
              <span className="font-bold text-slate-900 dark:text-white">Replying to {replyingToMessage.sender === "me" ? "yourself" : activeConv.name}:</span>
              <span className="text-slate-500 dark:text-fg-muted truncate italic">{replyingToMessage.text}</span>
            </div>
            <button 
              onClick={() => setReplyingToMessage(null)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              title="Cancel reply"
              aria-label="Cancel reply"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* MESSENGER INPUT COMPOSER / VOICE RECORDER */}
        <div className="p-3 sm:p-4 bg-white dark:bg-surface border-t border-slate-100 dark:border-line">
          {isRecordingVoice ? (
            /* Live Audio Recording State */
            <div className="flex items-center justify-between gap-3 max-w-5xl mx-auto p-1">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-mono font-bold text-red-500">
                  Recording {formatTimer(recordingSeconds)}
                </span>
                <div className="hidden sm:flex items-center gap-1 h-4">
                  {[20, 60, 100, 40, 80, 50, 90, 30].map((h, i) => (
                    <span 
                      key={i} 
                      className="w-1 bg-red-500 rounded-full animate-pulse" 
                      style={{ height: `${h}%` }} 
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecordingVoice(false)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-surface-2 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendVoiceNote}
                  className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span>Send Voice</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Regular Messenger Input Composer */
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2.5 w-full max-w-5xl mx-auto"
            >
              {/* Attachment Action (Clean single button) */}
              <button
                type="button"
                onClick={() => handleSendMessage("Shared assignment PDF: 3NF_Review.pdf")}
                className="p-2 rounded-full hover:bg-surface-2 text-fg-muted hover:text-brand transition-colors cursor-pointer shrink-0"
                title="Attach files"
                aria-label="Attach files"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Messenger Pill Input Field */}
              <div className="relative flex-1 min-w-0">
                <input 
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Message ${activeConv.nickname || activeConv.name.split(" ")[0]}...`}
                  aria-label={`Message ${activeConv.nickname || activeConv.name.split(" ")[0]}`}
                  className="w-full h-11 pl-4.5 pr-11 text-xs sm:text-sm font-medium rounded-full bg-slate-100 dark:bg-surface-2 text-slate-900 dark:text-fg placeholder:text-slate-400 dark:placeholder:text-fg-muted outline-none border border-slate-200/60 dark:border-line hover:border-slate-300 dark:hover:border-line focus:border-brand dark:focus:border-brand focus:ring-2 focus:ring-brand/30 shadow-2xs transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 dark:text-fg-muted hover:text-brand transition-colors cursor-pointer rounded-full hover:bg-slate-200/50 dark:hover:bg-surface-2"
                  title="Stickers & Emoji"
                  aria-label="Stickers & Emoji"
                >
                  <Smile className="w-4 h-4" />
                </button>

                {/* Emoji Quick Picker Popup */}
                {showEmojiPicker && (
                  <div className="absolute right-0 bottom-14 z-30 p-2 rounded-2xl bg-white dark:bg-surface-2 border border-slate-200 dark:border-line shadow-xl flex gap-1">
                    {["👍", "❤️", "🔥", "🎉", "👏", "💡", "📚", "🎯"].map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => {
                          setInputText(prev => prev + em);
                          setShowEmojiPicker(false);
                        }}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-surface-2 rounded-lg text-lg cursor-pointer"
                        aria-label={`Insert emoji ${em}`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button: Send Message */}
              
                {inputText.trim().length === 0 ? (
                  <button
                    type="button"
                    onClick={() => handleSendMessage(undefined, true)}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-120 active:scale-95 transition-transform motion-reduce:hover:scale-100 text-xl cursor-pointer"
                    title={`Send ${activeConv.quickEmoji || "👍"}`}
                    aria-label={`Send ${activeConv.quickEmoji || "thumbs up"}`}
                  >
                    <span>{activeConv.quickEmoji || "👍"}</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer shadow-sm ${activeTheme.bubble}`}
                    title="Send message"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                )}
              
            </form>
          )}
        </div>

      </main>

      {/* ========================================================= */}
      {/* COLUMN 3: MESSENGER CHAT DETAILS / PROFILE SIDEBAR        */}
      {/* ========================================================= */}
      {isDetailsOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 z-30 xl:hidden backdrop-blur-2xs" 
            onClick={() => setIsDetailsOpen(false)} 
            aria-hidden="true" 
          />

          {/* Resizer Handle: Column 2 <-> Column 3 (Desktop XL) */}
          <div
            role="separator"
            tabIndex={0}
            aria-orientation="vertical"
            aria-valuenow={rightPanelWidth}
            aria-valuemin={260}
            aria-valuemax={480}
            aria-label="Resize conversation details panel"
            onMouseDown={handleRightResizeStart}
            onDoubleClick={() => setRightPanelWidth(320)}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                setRightPanelWidth(prev => Math.min(prev + 10, 480));
              } else if (e.key === "ArrowRight") {
                e.preventDefault();
                setRightPanelWidth(prev => Math.max(prev - 10, 260));
              }
            }}
            title="Drag to resize panel (Double-click to reset)"
            className={`hidden xl:flex w-2 -mx-1 shrink-0 cursor-col-resize group relative items-center justify-center transition-colors select-none z-20 outline-none focus-visible:bg-brand/20 ${
              isDraggingRight ? "bg-brand/30" : "hover:bg-brand/20"
            }`}
          >
            <div className={`w-0.5 h-8 rounded-full transition-colors ${
              isDraggingRight ? "bg-brand" : "bg-slate-300 dark:bg-border-line group-hover:bg-brand"
            }`} />
          </div>

          <aside className="fixed inset-y-0 right-0 z-40 w-80 sm:w-[340px] xl:static xl:w-[var(--right-panel-width)] xl:z-auto shadow-2xl xl:shadow-none border-l border-slate-200 dark:border-line bg-white dark:bg-surface flex flex-col shrink-0 overflow-y-auto">
            
            {/* Header */}
            <div className="h-16 px-4 border-b border-slate-100 dark:border-line flex items-center justify-between shrink-0">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-fg">
                Chat Details
              </h3>
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-surface-2 text-slate-500 cursor-pointer"
                title="Close details"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

          <div className="p-4 space-y-6">
            
            {/* Contact Large Avatar & Identity */}
            <div className="flex flex-col items-center text-center pt-2">
              <ProfileAvatar 
                className="w-20 h-20 border-2 border-slate-200 dark:border-line mb-3"
                iconClassName="w-10 h-10"
              />
              
              {isEditingNickname ? (
                <div className="flex items-center gap-1.5 mt-1">
                  <input 
                    type="text"
                    value={nicknameInput}
                    onChange={(e) => setNicknameInput(e.target.value)}
                    placeholder="Nickname..."
                    aria-label="Edit nickname"
                    className="px-2 py-1 text-xs rounded-lg border border-brand bg-white dark:bg-surface-2 text-slate-900 dark:text-white outline-none"
                    autoFocus
                  />
                  <button 
                    onClick={handleSaveNickname}
                    title="Save nickname"
                    aria-label="Save nickname"
                    className="p-1 bg-brand text-white rounded-lg text-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <h4 className="text-base font-black text-slate-900 dark:text-fg">
                    {activeConv.nickname || activeConv.name}
                  </h4>
                  <button 
                    onClick={() => {
                      setNicknameInput(activeConv.nickname || activeConv.name);
                      setIsEditingNickname(true);
                    }}
                    className="p-1 text-slate-400 dark:text-fg-muted hover:text-brand cursor-pointer"
                    title="Edit nickname"
                    aria-label="Edit nickname"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
              )}

              <p className="text-xs text-slate-500 dark:text-fg-muted mt-0.5 max-w-[240px]">
                {activeConv.role}
              </p>
              <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {activeConv.isOnline ? "Active Now" : "Offline"}
              </span>
            </div>

            {/* Messenger Circular Action Buttons: Profile, Mute, Search */}
            <div className="grid grid-cols-3 gap-2 px-2">
              <button 
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-surface-2 transition-colors cursor-pointer group"
                title="View academic profile"
                aria-label="View academic profile"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-surface-2 group-hover:bg-brand/10 flex items-center justify-center text-slate-700 dark:text-fg group-hover:text-brand transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-fg-muted">
                  Profile
                </span>
              </button>

              <button 
                onClick={handleToggleMute}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-surface-2 transition-colors cursor-pointer group"
                title={activeConv.isMuted ? "Unmute notifications" : "Mute notifications"}
                aria-label={activeConv.isMuted ? "Unmute notifications" : "Mute notifications"}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  activeConv.isMuted 
                    ? "bg-amber-500/15 text-amber-500" 
                    : "bg-slate-100 dark:bg-surface-2 group-hover:bg-brand/10 text-slate-700 dark:text-fg group-hover:text-brand"
                }`}>
                  {activeConv.isMuted ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-fg-muted">
                  {activeConv.isMuted ? "Muted" : "Mute"}
                </span>
              </button>

              <button 
                onClick={() => setIsSearchInChatOpen(true)}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-surface-2 transition-colors cursor-pointer group"
                title="Search conversation"
                aria-label="Search conversation"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-surface-2 group-hover:bg-brand/10 flex items-center justify-center text-slate-700 dark:text-fg group-hover:text-brand transition-colors">
                  <Search className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-fg-muted">
                  Search
                </span>
              </button>
            </div>

            {/* Accordion 1: Campus Chat Info */}
            <div className="border border-slate-200 dark:border-line rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === "info" ? null : "info")}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-surface-2 flex items-center justify-between font-bold text-xs text-slate-800 dark:text-fg cursor-pointer"
              >
                <span>Academic & Campus Info</span>
                {expandedSection === "info" ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {expandedSection === "info" && (
                <div className="p-3.5 space-y-3 bg-white dark:bg-surface text-xs">
                  {activeConv.consultationHours && (
                    <div>
                      <div className="text-xs uppercase font-bold text-slate-400 dark:text-fg-muted">
                        Consultation Schedule
                      </div>
                      <div className="text-slate-800 dark:text-fg font-medium mt-0.5">
                        {activeConv.consultationHours}
                      </div>
                    </div>
                  )}

                  {activeConv.cabin && (
                    <div>
                      <div className="text-xs uppercase font-bold text-slate-400 dark:text-fg-muted">
                        Faculty Cabin / Office
                      </div>
                      <div className="text-slate-800 dark:text-fg font-medium mt-0.5">
                        {activeConv.cabin}
                      </div>
                    </div>
                  )}

                  {activeConv.email && (
                    <div>
                      <div className="text-xs uppercase font-bold text-slate-400 dark:text-fg-muted">
                        University Email
                      </div>
                      <a 
                        href={`mailto:${activeConv.email}`}
                        className="text-brand hover:underline font-medium mt-0.5 flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" />
                        <span>{activeConv.email}</span>
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Accordion 2: Messenger Customization (Theme & Quick Emoji) */}
            <div className="border border-slate-200 dark:border-line rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === "customize" ? null : "customize")}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-surface-2 flex items-center justify-between font-bold text-xs text-slate-800 dark:text-fg cursor-pointer"
              >
                <span>Customize Chat</span>
                {expandedSection === "customize" ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {expandedSection === "customize" && (
                <div className="p-3.5 space-y-4 bg-white dark:bg-surface">
                  {/* Theme Gradient Selector */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-fg-muted mb-2 block">
                      Chat Gradient Theme
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.keys(THEME_GRADIENTS) as MessengerTheme[]).map((themeKey) => {
                        const t = THEME_GRADIENTS[themeKey];
                        const isCurrent = activeConv.themeColor === themeKey;
                        return (
                          <button
                            key={themeKey}
                            onClick={() => handleChangeTheme(themeKey)}
                            className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                              isCurrent 
                                ? "border-brand bg-brand/5 dark:bg-brand/10 ring-1 ring-brand" 
                                : "border-slate-200 dark:border-line hover:bg-slate-50 dark:hover:bg-surface-2"
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full bg-gradient-to-tr ${t.ring} shadow-xs shrink-0`} />
                            <span className="text-xs font-bold truncate text-slate-800 dark:text-fg">
                              {t.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Change Quick Emoji */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-fg-muted mb-2 block">
                      Quick Reaction Emoji
                    </label>
                    <div className="flex items-center gap-2">
                      {["👍", "❤️", "🔥", "💡", "👏", "🎓"].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleChangeQuickEmoji(emoji)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform cursor-pointer ${
                            activeConv.quickEmoji === emoji 
                              ? "bg-brand/15 ring-2 ring-brand scale-110" 
                              : "bg-slate-100 hover:bg-slate-200 dark:bg-surface-2 dark:hover:bg-surface-2"
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 3: Shared Files & Documents */}
            <div className="border border-slate-200 dark:border-line rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === "files" ? null : "files")}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-surface-2 flex items-center justify-between font-bold text-xs text-slate-800 dark:text-fg cursor-pointer"
              >
                <span>Shared Files & Documents</span>
                {expandedSection === "files" ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {expandedSection === "files" && (
                <div className="p-3 bg-white dark:bg-surface space-y-2">
                  {(!activeConv.sharedFiles || activeConv.sharedFiles.length === 0) ? (
                    <p className="text-xs text-slate-400 dark:text-fg-muted p-2 text-center">No files shared yet.</p>
                  ) : (
                    activeConv.sharedFiles.map(file => (
                      <div 
                        key={file.id}
                        className="p-2 rounded-xl bg-slate-50 dark:bg-surface-2 border border-slate-200/80 dark:border-line flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 dark:text-fg truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-fg-muted font-mono">
                              {file.size} • {file.date}
                            </p>
                          </div>
                        </div>

                        <button 
                          onClick={() => alert(`Downloading ${file.name}...`)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand hover:bg-white dark:hover:bg-surface-2 transition-colors cursor-pointer shrink-0"
                          title="Download document"
                          aria-label={`Download document ${file.name}`}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Accordion 4: Shared Photos Gallery */}
            <div className="border border-slate-200 dark:border-line rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === "photos" ? null : "photos")}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-surface-2 flex items-center justify-between font-bold text-xs text-slate-800 dark:text-fg cursor-pointer"
              >
                <span>Shared Media & Photos</span>
                {expandedSection === "photos" ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {expandedSection === "photos" && (
                <div className="p-3 bg-white dark:bg-surface">
                  {(!activeConv.sharedPhotos || activeConv.sharedPhotos.length === 0) ? (
                    <p className="text-xs text-slate-400 dark:text-fg-muted p-2 text-center">No photos shared.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {activeConv.sharedPhotos.map((photo, i) => (
                        <button 
                          type="button"
                          key={i} 
                          onClick={() => setLightboxImage(photo)}
                          className="relative h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-line cursor-pointer hover:opacity-90 transition-opacity w-full block text-left"
                          aria-label={`View photo ${i + 1}`}
                        >
                          <Image src={photo} alt="Shared" fill sizes="120px" className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Accordion 5: Privacy & Verification */}
            <div className="border border-slate-200 dark:border-line rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === "privacy" ? null : "privacy")}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-surface-2 flex items-center justify-between font-bold text-xs text-slate-800 dark:text-fg cursor-pointer"
              >
                <span>Privacy & Verification</span>
                {expandedSection === "privacy" ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {expandedSection === "privacy" && (
                <div className="p-3.5 space-y-3 bg-white dark:bg-surface text-xs">
                  <div className="flex items-start gap-2.5 text-slate-600 dark:text-fg-muted">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Messages and calls are end-to-end encrypted with UniCampus 256-bit Security.</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-line flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-fg">Report Academic Issue</span>
                    <button 
                      onClick={() => alert("Report submitted to Campus Integrity Desk.")}
                      className="text-xs text-red-500 hover:underline font-bold cursor-pointer"
                    >
                      Report
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </aside>
        </>
      )}

      {/* ========================================================= */}
      {/* FULL-SCREEN MESSENGER LIGHTBOX MEDIA VIEWER               */}
      {/* ========================================================= */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button 
            onClick={() => setLightboxImage(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-4xl max-h-[85vh] w-full h-[70vh]">
            <Image 
              src={lightboxImage} 
              alt="Expanded media view" 
              fill 
              sizes="100vw" 
              className="object-contain" 
            />
          </div>

          <div className="absolute bottom-6 flex items-center gap-3">
            <button 
              onClick={() => alert("Downloading photo...")}
              className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-2 cursor-pointer backdrop-blur-xs"
            >
              <Download className="w-4 h-4" />
              <span>Save Photo</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MESSENGER NOTE STATUS MODAL                               */}
      {/* ========================================================= */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-surface border border-slate-200 dark:border-line p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Share a note</h3>
              <button 
                onClick={() => setIsNoteModalOpen(false)} 
                className="text-slate-400 dark:text-fg-muted hover:text-slate-700 dark:hover:text-white cursor-pointer"
                title="Close dialog"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center mb-4">
              <ProfileAvatar 
                className="w-16 h-16 border-2 border-brand mb-2"
                iconClassName="w-8 h-8"
              />
              <p className={`text-xs text-fg-muted`}>Your note will be visible to classmates for 24 hours.</p>
            </div>

            <input 
              type="text"
              maxLength={60}
              value={userStatusNote}
              onChange={(e) => setUserStatusNote(e.target.value)}
              placeholder="Share what's on your mind..."
              aria-label="Share what's on your mind"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-surface-2 text-xs text-slate-900 dark:text-white outline-none border border-transparent focus:border-brand focus:ring-2 focus:ring-brand/40 mb-3"
            />

            <div className="flex items-center gap-1.5 flex-wrap mb-4">
              {["Studying for Midterms 📚", "In AI Lab 💻", "Free for Consultations ☕", "Working on Capstone 🚀"].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setUserStatusNote(preset)}
                  className="text-xs px-2 py-1 rounded-lg bg-slate-100 dark:bg-surface-2 text-slate-600 dark:text-fg-muted hover:text-brand cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setIsNoteModalOpen(false)}
              className={`w-full py-2.5 bg-brand text-white hover:bg-brand-hover text-xs font-bold cursor-pointer`}
            >
              Share Note
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* NEW CONVERSATION MODAL                                    */}
      {/* ========================================================= */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-surface border border-slate-200 dark:border-line p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">New Message</h3>
              <button 
                onClick={() => setIsNewChatModalOpen(false)} 
                className="text-slate-400 dark:text-fg-muted hover:text-slate-700 dark:hover:text-white cursor-pointer"
                title="Close dialog"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-fg-muted" />
              <input 
                type="text"
                placeholder="To: Type a student, teacher, or department..."
                aria-label="To: Type a student, teacher, or department"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-full bg-slate-100 dark:bg-surface-2 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1">
              <p className="text-xs uppercase font-bold text-slate-400 dark:text-fg-muted px-1 mb-1">Suggested Contacts</p>
              {conversations.map(c => (
                <button 
                  type="button"
                  key={c.id} 
                  onClick={() => {
                    setActiveConvId(c.id);
                    setIsNewChatModalOpen(false);
                  }}
                  aria-label={`Start conversation with ${c.name}`}
                  className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-surface-2 flex items-center gap-2.5 cursor-pointer"
                >
                  <ProfileAvatar 
                    className="w-8 h-8 border border-slate-200 dark:border-line"
                    iconClassName="w-4 h-4"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{c.name}</p>
                    <p className="text-xs text-slate-400 dark:text-fg-muted truncate">{c.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SIMULATED MESSENGER AUDIO / VIDEO CALL MODAL              */}
      {/* ========================================================= */}
      {activeCallType && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4`}>
          <div className={`w-full max-w-xl rounded-3xl bg-surface border border-line overflow-hidden text-center relative shadow-2xl flex flex-col`}>
            
            {/* Top Bar */}
            <div className="p-4 flex items-center justify-between z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Messenger {activeCallType === "video" ? "Video Call" : "Audio Call"} • {formatTimer(callDuration)}</span>
              </div>

              <button 
                onClick={() => setActiveCallType(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-full cursor-pointer"
                title="End call dialog"
                aria-label="End call dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video or Audio Viewport */}
            {activeCallType === "video" ? (
              <div className="relative w-full h-80 bg-slate-900 flex items-center justify-center overflow-hidden">
                {!isCameraOff ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-950">
                    <ProfileAvatar className="w-28 h-28 border-4 border-brand/50 shadow-lg" iconClassName="w-14 h-14" />
                    <div className="absolute bottom-3 left-3 bg-black/60 px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-xs text-white">
                      {activeConv.name}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <ProfileAvatar className="w-20 h-20 border-2 border-brand mb-2" iconClassName="w-10 h-10" />
                    <p className={`text-xs text-fg-muted`}>Camera is paused</p>
                  </div>
                )}

                {/* Picture in Picture Self-View */}
                <div className="absolute top-3 right-3 w-28 h-20 rounded-2xl overflow-hidden border-2 border-white/40 shadow-lg bg-slate-800 flex items-center justify-center">
                  <ProfileAvatar className="w-12 h-12" iconClassName="w-6 h-6" />
                  <span className="absolute bottom-1 right-1 text-xs bg-black/70 px-1 rounded text-white font-mono">You</span>
                </div>
              </div>
            ) : (
              <div className="py-12">
                <div className="relative w-28 h-28 mx-auto mb-4">
                  <ProfileAvatar className="w-full h-full border-4 border-brand relative z-10" iconClassName="w-14 h-14" />
                </div>

                <h3 className="text-xl font-black mb-1 text-slate-900 dark:text-fg">
                  {activeConv.name}
                </h3>
                <p className={`text-xs text-fg-muted font-mono`}>
                  Connected • VoIP 256-bit Encrypted
                </p>
              </div>
            )}

            {/* Bottom Call Control Action Bar */}
            <div className={`p-4 bg-slate-50 dark:bg-surface-2 border-t border-line flex items-center justify-center gap-4`}>
              <button 
                onClick={() => setIsCallMuted(!isCallMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                  isCallMuted ? "bg-red-500/20 text-red-500" : "bg-white dark:bg-surface-2 hover:bg-slate-100 dark:hover:bg-surface-2 text-slate-700 dark:text-white border border-slate-200 dark:border-line"
                }`}
                title={isCallMuted ? "Unmute mic" : "Mute mic"}
                aria-label={isCallMuted ? "Unmute microphone" : "Mute microphone"}
              >
                {isCallMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {activeCallType === "video" && (
                <>
                  <button 
                    onClick={() => setIsCameraOff(!isCameraOff)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                      isCameraOff ? "bg-red-500/20 text-red-500" : "bg-white dark:bg-surface-2 hover:bg-slate-100 dark:hover:bg-surface-2 text-slate-700 dark:text-white border border-slate-200 dark:border-line"
                    }`}
                    title={isCameraOff ? "Turn camera on" : "Turn camera off"}
                    aria-label={isCameraOff ? "Turn camera on" : "Turn camera off"}
                  >
                    {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  </button>

                  <button 
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                      isScreenSharing ? "bg-brand text-white" : "bg-white dark:bg-surface-2 hover:bg-slate-100 dark:hover:bg-surface-2 text-slate-700 dark:text-white border border-slate-200 dark:border-line"
                    }`}
                    title="Share screen"
                    aria-label="Share screen"
                  >
                    <Monitor className="w-5 h-5" />
                  </button>
                </>
              )}

              <button 
                onClick={() => setActiveCallType(null)}
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform motion-reduce:hover:scale-100 cursor-pointer"
                title="End call"
                aria-label="End call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}