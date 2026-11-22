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

export const THEME_GRADIENTS: Record<MessengerTheme, { bubble: string; ring: string; label: string }> = {
  classic: {
    bubble: "bg-brand text-on-brand",
    ring: "from-brand to-brand",
    label: "Brand Indigo"
  },
  violet: {
    bubble: "bg-brand text-on-brand",
    ring: "from-brand to-brand/70",
    label: "Cyber Violet"
  },
  sunset: {
    bubble: "bg-warning text-on-brand",
    ring: "from-warning to-warning",
    label: "Sunset Flare"
  },
  emerald: {
    bubble: "bg-success text-on-brand",
    ring: "from-success to-success",
    label: "Emerald Campus"
  }
};

export const EMOJI_REACTIONS_LIST = ["❤️", "👍", "😆", "😮", "😢", "🔥"];

export const playMessengerChime = (type: "pop" | "ding") => {
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

export const formatTimer = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const INITIAL_STUDENT_CONVERSATIONS: Conversation[] = [
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

export const INITIAL_TEACHER_CONVERSATIONS: Conversation[] = [
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
    role: "Central Administration • Admin",
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

