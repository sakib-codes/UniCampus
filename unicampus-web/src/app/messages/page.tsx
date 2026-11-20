"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  Conversation,
  INITIAL_STUDENT_CONVERSATIONS,
  INITIAL_TEACHER_CONVERSATIONS,
  MessageItem,
  MessengerTheme,
  playMessengerChime,
  ConversationList,
  ChatHeader,
  MessageStream,
  MessageComposer,
  ThreadInfoDrawer,
  ActiveCallModal,
  NoteModal,
  NewChatModal,
  LightboxModal,
} from "@/components/messages";

export type {
  MessengerTheme,
  MessageReaction,
  SharedFile,
  MessageItem,
  Conversation,
} from "@/components/messages";

export default function MessagesPage() {
  const { currentUser } = useAdminAuth();
  const isTeacher = currentUser?.role === "teacher";

  const [conversations, setConversations] = useState<Conversation[]>(
    isTeacher ? INITIAL_TEACHER_CONVERSATIONS : INITIAL_STUDENT_CONVERSATIONS
  );
  const [activeConvId, setActiveConvId] = useState<string>(
    isTeacher ? "t-conv-1" : "conv-1"
  );
  const [activeCategory, setActiveCategory] = useState<
    "all" | "faculty" | "peers" | "office"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileConversationOpen, setIsMobileConversationOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeReactionMessageId, setActiveReactionMessageId] = useState<string | null>(null);

  // Advanced States
  const [isTyping, setIsTyping] = useState(false);
  const [replyingToMessage, setReplyingToMessage] = useState<MessageItem | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // In-Chat Search
  const [isSearchInChatOpen, setIsSearchInChatOpen] = useState(false);
  const [inChatSearchTerm, setInChatSearchTerm] = useState("");

  // Status Note Modal
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [userStatusNote, setUserStatusNote] = useState("Studying for Midterms 📚");

  // New Chat Modal
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  // Call simulation state
  const [activeCallType, setActiveCallType] = useState<"audio" | "video" | null>(null);

  // Resizable panel widths
  const [leftPanelWidth, setLeftPanelWidth] = useState(350);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setConversations(
        isTeacher ? INITIAL_TEACHER_CONVERSATIONS : INITIAL_STUDENT_CONVERSATIONS
      );
      setActiveConvId(isTeacher ? "t-conv-1" : "conv-1");
    });
  }, [isTeacher]);

  const activeConv = useMemo(() => {
    return (
      conversations.find((c) => c.id === activeConvId) || conversations[0]
    );
  }, [conversations, activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages, isTyping]);

  const handleSendMessage = useCallback(
    (
      textToSend?: string,
      isThumbsUp: boolean = false,
      imageAttachment?: string,
      isVoiceNote: boolean = false,
      voiceDuration?: string
    ) => {
      if (!activeConv) return;

      const text = isThumbsUp
        ? activeConv.quickEmoji || "👍"
        : isVoiceNote
        ? "Voice Message"
        : (textToSend || "").trim();

      if (!text && !imageAttachment && !isVoiceNote) return;

      playMessengerChime("pop");

      const newMsg: MessageItem = {
        id: `msg-${Date.now()}`,
        sender: "me",
        text,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "delivered",
        isThumbsUp,
        thumbsUpEmoji: isThumbsUp ? text : undefined,
        replyTo: replyingToMessage
          ? {
              id: replyingToMessage.id,
              text: replyingToMessage.text,
              sender:
                replyingToMessage.sender === "me"
                  ? "You"
                  : activeConv.nickname || activeConv.name,
            }
          : undefined,
        imageAttachment,
        isVoiceNote,
        voiceDuration,
      };

      setConversations((prev) =>
        prev.map((conv) => {
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
            messages: [...conv.messages, newMsg],
          };
        })
      );

      setReplyingToMessage(null);
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
            : `Thank you for reaching out. I have received your message: "${text.slice(
                0,
                36
              )}...". I will review it shortly.`,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "seen",
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
    },
    [activeConv, isTeacher, replyingToMessage]
  );

  const handleToggleReaction = useCallback(
    (messageId: string, emoji: string) => {
      if (!activeConv) return;
      playMessengerChime("pop");

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id !== activeConv.id) return conv;
          return {
            ...conv,
            messages: conv.messages.map((msg) => {
              if (msg.id !== messageId) return msg;
              const currentReactions = msg.reactions || [];
              const existing = currentReactions.find((r) => r.emoji === emoji);

              let updatedReactions: { emoji: string; count: number; reactedByMe?: boolean }[];
              if (existing) {
                if (existing.reactedByMe) {
                  updatedReactions = currentReactions
                    .map((r) =>
                      r.emoji === emoji
                        ? { ...r, count: r.count - 1, reactedByMe: false }
                        : r
                    )
                    .filter((r) => r.count > 0);
                } else {
                  updatedReactions = currentReactions.map((r) =>
                    r.emoji === emoji
                      ? { ...r, count: r.count + 1, reactedByMe: true }
                      : r
                  );
                }
              } else {
                updatedReactions = [
                  ...currentReactions,
                  { emoji, count: 1, reactedByMe: true },
                ];
              }

              return {
                ...msg,
                reactions: updatedReactions,
              };
            }),
          };
        })
      );
      setActiveReactionMessageId(null);
    },
    [activeConv]
  );

  const handleTogglePinMessage = useCallback(
    (messageId: string) => {
      if (!activeConv) return;
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id !== activeConv.id) return conv;
          const isPinned = conv.pinnedMessageId === messageId;
          return {
            ...conv,
            pinnedMessageId: isPinned ? undefined : messageId,
          };
        })
      );
      setActiveReactionMessageId(null);
    },
    [activeConv]
  );

  const handleChangeTheme = useCallback(
    (theme: MessengerTheme) => {
      if (!activeConv) return;
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConv.id ? { ...c, themeColor: theme } : c
        )
      );
    },
    [activeConv]
  );

  const handleChangeQuickEmoji = useCallback(
    (emoji: string) => {
      if (!activeConv) return;
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConv.id ? { ...c, quickEmoji: emoji } : c
        )
      );
    },
    [activeConv]
  );

  const handleToggleMute = useCallback(
    (targetId?: string) => {
      const idToMute = targetId || activeConv?.id;
      if (!idToMute) return;
      setConversations((prev) =>
        prev.map((c) =>
          c.id === idToMute ? { ...c, isMuted: !c.isMuted } : c
        )
      );
    },
    [activeConv]
  );

  const handleSaveNickname = useCallback(
    (name: string) => {
      if (!activeConv) return;
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConv.id ? { ...c, nickname: name } : c
        )
      );
    },
    [activeConv]
  );

  const handleSelectConversation = useCallback((id: string) => {
    setActiveConvId(id);
    setIsMobileConversationOpen(true);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  }, []);

  // Resizers
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

  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      const matchesSearch =
        conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "all" || conv.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [conversations, searchQuery, activeCategory]);

  return (
    <div
      style={
        {
          "--left-panel-width": `${leftPanelWidth}px`,
          "--right-panel-width": `${rightPanelWidth}px`,
        } as React.CSSProperties
      }
      className="h-full w-full flex min-h-0 overflow-hidden bg-surface font-sans antialiased select-text"
    >
      {/* COLUMN 1: CHATS DIRECTORY (Messenger Sidebar) */}
      <ConversationList
        conversations={conversations}
        filteredConversations={filteredConversations}
        activeConvId={activeConv.id}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        isTyping={isTyping}
        userStatusNote={userStatusNote}
        isMobileConversationOpen={isMobileConversationOpen}
        onSearchChange={setSearchQuery}
        onCategoryChange={setActiveCategory}
        onSelectConversation={handleSelectConversation}
        onToggleMute={handleToggleMute}
        onOpenNewChatModal={() => setIsNewChatModalOpen(true)}
        onOpenNoteModal={() => setIsNoteModalOpen(true)}
      />

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
            setLeftPanelWidth((prev) => Math.max(prev - 10, 260));
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            setLeftPanelWidth((prev) => Math.min(prev + 10, 520));
          }
        }}
        title="Drag to resize panel (Double-click to reset)"
        className={`hidden md:flex w-2 -mx-1 shrink-0 cursor-col-resize group relative items-center justify-center transition-colors select-none z-20 outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:bg-brand/20 ${
          isDraggingLeft ? "bg-brand/30" : "hover:bg-brand/20"
        }`}
      >
        <div
          className={`w-0.5 h-8 rounded-full transition-colors ${
            isDraggingLeft ? "bg-brand" : "bg-line group-hover:bg-brand"
          }`}
        />
      </div>

      {/* COLUMN 2: MESSENGER CHAT STREAM (Center Window) */}
      <main
        className={`flex-1 flex flex-col min-w-0 bg-surface ${
          !isMobileConversationOpen ? "hidden md:flex" : "flex"
        }`}
      >
        <ChatHeader
          activeConv={activeConv}
          isDetailsOpen={isDetailsOpen}
          isSearchInChatOpen={isSearchInChatOpen}
          inChatSearchTerm={inChatSearchTerm}
          onBackMobile={() => setIsMobileConversationOpen(false)}
          onToggleSearchInChat={() => setIsSearchInChatOpen(!isSearchInChatOpen)}
          onSearchTermChange={setInChatSearchTerm}
          onStartCall={setActiveCallType}
          onToggleDetails={() => setIsDetailsOpen(!isDetailsOpen)}
        />

        <MessageStream
          activeConv={activeConv}
          inChatSearchTerm={inChatSearchTerm}
          isTyping={isTyping}
          activeReactionMessageId={activeReactionMessageId}
          playingVoiceId={playingVoiceId}
          messagesEndRef={messagesEndRef}
          onHoverReaction={setActiveReactionMessageId}
          onToggleReaction={handleToggleReaction}
          onReplyTo={setReplyingToMessage}
          onTogglePin={handleTogglePinMessage}
          onPlayVoice={setPlayingVoiceId}
          onOpenLightbox={setLightboxImage}
        />

        <MessageComposer
          activeConv={activeConv}
          replyingToMessage={replyingToMessage}
          onClearReply={() => setReplyingToMessage(null)}
          onSendMessage={handleSendMessage}
        />
      </main>

      {/* COLUMN 3: MESSENGER CHAT DETAILS / PROFILE SIDEBAR */}
      <ThreadInfoDrawer
        activeConv={activeConv}
        isDetailsOpen={isDetailsOpen}
        rightPanelWidth={rightPanelWidth}
        isDraggingRight={isDraggingRight}
        onClose={() => setIsDetailsOpen(false)}
        onRightResizeStart={handleRightResizeStart}
        onResetRightWidth={() => setRightPanelWidth(320)}
        onStepRightWidth={(delta) =>
          setRightPanelWidth((prev) =>
            Math.min(Math.max(prev + delta, 260), 480)
          )
        }
        onToggleMute={() => handleToggleMute()}
        onOpenSearch={() => setIsSearchInChatOpen(true)}
        onChangeTheme={handleChangeTheme}
        onChangeQuickEmoji={handleChangeQuickEmoji}
        onSaveNickname={handleSaveNickname}
        onOpenLightbox={setLightboxImage}
      />

      {/* MODALS */}
      <LightboxModal
        imageUrl={lightboxImage}
        onClose={() => setLightboxImage(null)}
      />

      <NoteModal
        isOpen={isNoteModalOpen}
        initialNote={userStatusNote}
        onClose={() => setIsNoteModalOpen(false)}
        onSaveNote={setUserStatusNote}
      />

      <NewChatModal
        isOpen={isNewChatModalOpen}
        conversations={conversations}
        onClose={() => setIsNewChatModalOpen(false)}
        onSelect={handleSelectConversation}
      />

      <ActiveCallModal
        activeCallType={activeCallType}
        activeConv={activeConv}
        onClose={() => setActiveCallType(null)}
      />
    </div>
  );
}
