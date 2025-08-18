"use client"

import { useState, useRef, useEffect } from "react"
import { useMutation, useQuery } from "convex/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

import {
  MessageCircle,
  Send,
  CheckCircle,
  Clock,
  Shield,
  ChevronDown,
  ChevronUp,
  Paperclip,
  X,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Id } from "../../../convex/_generated/dataModel"
import { api } from "../../../convex/_generated/api"
import { Skeleton } from "../ui/skeleton"

interface ChatWidgetProps {
  seller: {
    _id: Id<"users">
    name: string
    avatar: string
    rating: number
    reviews: number
    verified: boolean
    responseTime: string
    location: string
  }
  item: {
    _id: Id<"listing">
    title: string
    price: number
    image: string
  }
}

interface Message {
  _id: Id<"message">
  _creationTime: number
  content: string
  senderId: string
  recipientId: string
  read: boolean
  type: string
  conversationId: Id<"conversations">
  sentAt: number
}

export function ChatWidget({ seller, item }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const user = useQuery(api.resources.users.authenticated)

  console.log("seller", seller)

  // Get or create conversation
  const getOrCreateConversation = useMutation(api.chat.conversations.getOrCreateConversation)
  const sendMessage = useMutation(api.chat.messages.sendMessage)
  const markMessagesAsRead = useMutation(api.chat.messages.markMessagesAsRead)
  
  // Get conversation ID
  const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null)

  // Get messages for the current conversation
  const messages = useQuery(api.chat.messages.getMessages, 
    isOpen && user?._id && conversationId
      ? { 
          conversationId,
          userId: user._id as Id<"users">,
          limit: 50
        } 
      : 'skip'
  )
  
  // Debug: Log messages and user info
  useEffect(() => {
    if (messages) {
      console.log('Current messages:', messages);
      console.log('Current user ID:', user?._id);
    }
  }, [messages, user?._id])

  // Initialize conversation when component mounts
  useEffect(() => {
    if (isOpen && user?._id) {
      const initializeConversation = async () => {
        try {
          // Determine if current user is the seller or buyer
          const isSeller = user._id === seller?._id;
          
          const result = await getOrCreateConversation({
            listingId: item?._id as Id<"listing">,
            buyerId: isSeller ? seller?._id as Id<"users"> : user._id as Id<"users">,
            sellerId: isSeller ? user._id as Id<"users"> : seller?._id as Id<"users">,
          });
          
          console.log('Conversation initialized:', result);
          setConversationId(result?._id ?? null);
        } catch (error) {
          console.error("Error initializing conversation:", error);
        }
      };
      initializeConversation();
    }
  }, [isOpen, user?._id, item?._id, seller?._id, getOrCreateConversation]);

  // Mark messages as read when opening the chat and handle unread messages
  useEffect(() => {
    if (isOpen && conversationId && user?._id && messages?.unreadMessageIds?.length) {
      // Mark messages as read
      markMessagesAsRead({
        messageIds: messages.unreadMessageIds,
        conversationId,
      });
      
      // Update local state to remove unread indicators
      if (messages.messages) {
        messages.messages = messages.messages.map(msg => ({
          ...msg,
          read: messages.unreadMessageIds.includes(msg._id) ? true : msg.read
        }));
      }
    }
  }, [isOpen, conversationId, user?._id, messages?.unreadMessageIds]);

  const handleSendMessage = async (messageText?: string) => {
    const finalMessage = messageText || message
    if (finalMessage.trim() && conversationId && user?._id) {
      setError(null) // Clear previous errors
      try {
        await sendMessage({
          conversationId,
          senderId: user?._id as Id<"users">,
          content: finalMessage,
          type: "text"
        })
        setMessage("")
      } catch (error: any) {
        console.error("Error sending message:", error)
        setError(error.message || "Failed to send message. Please try again.")
        
        // Auto-hide the error after 5 seconds
        setTimeout(() => setError(null), 5000);
      }
    }
  }

  const quickMessages = [
    "Is this item still available?",
    "What's your best price?",
    "Can I see more photos?",
    "When can we meet?",
    "Is the price negotiable?",
  ]

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleQuickMessage = (quickMsg: string) => {
    setMessage(quickMsg)
    // Small delay to ensure state updates before sending
    setTimeout(() => handleSendMessage(quickMsg), 0)
  }

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p>Please sign in to chat with the seller</p>
      </div>
    )
  }

  const isLoading = messages === undefined
  const messageList = messages?.messages || []
  const isSeller = user?._id === seller?._id
  
  // Check if there are unread messages
  const hasUnreadMessages = messageList.some(
    (msg) => !msg.read && msg.senderId !== user?._id
  )

  return (
    <div className="w-full overflow-x-hidden">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border py-6 ${hasUnreadMessages ? 'bg-[#088b56] text-white' : 'bg-transparent border-[#088b56] text-[#088b56] hover:bg-[#088b56] hover:text-white'} relative`}
        disabled={!user}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        {isSeller ? 'View Messages' : 'Chat with Seller'}
        {hasUnreadMessages && (
          <span className="absolute top-0 right-2 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
        {isOpen ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
      </Button>

      {isOpen && (
        <Card className="mt-4 dark:bg-gray-900/95 py-4 backdrop-blur-sm border-gray-700/50 animate-in slide-in-from-top-2 duration-300 overflow-x-hidden">
          <CardHeader className="pb-3 border-b ">
            <div className="flex items-center justify-between ">
              <CardTitle className="dark:text-white flex items-center text-lg ">
                <MessageCircle className="w-5 h-5 mr-2 text-[#088b56]" />
                Chat with {seller.name}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white "
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="h-96 flex flex-col-reverse overflow-y-auto  p-4 space-y-4 space-y-reverse">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-16 w-64" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {messageList.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      <p>No messages yet. Say hi!</p>
                    </div>
                  ) : (
                    messageList.map((msg) => {
                      const isCurrentUser = msg.senderId === user?._id
                      const messageDate = new Date(msg.sentAt)
                      const timeAgo = formatDistanceToNow(messageDate, { addSuffix: true })
                      
                      return (
                        <div
                          key={msg._id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isCurrentUser && (
                            <Avatar className="h-8 w-8 mr-2 mt-1">
                              <AvatarImage src={isSeller ? undefined : seller.avatar} />
                              <AvatarFallback>
                                {seller.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isCurrentUser
                                ? 'bg-[#088b56] text-white rounded-br-none'
                                : 'bg-gray-100 text-gray-900 rounded-bl-none'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isCurrentUser ? 'text-gray-200' : 'text-gray-500'
                              }`}
                            >
                              {timeAgo}
                              {!isCurrentUser && !msg.read && (
                                <span className="ml-1 inline-flex items-center">
                                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block mr-1"></span>
                                  Unread
                                </span>
                              )}
                            </p>
                          </div>
                          {isCurrentUser && (
                            <div className="ml-2 flex items-end">
                              {msg.read ? (
                                <CheckCircle className="h-3 w-3 text-gray-400" />
                              ) : (
                                <Clock className="h-3 w-3 text-gray-400" />
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} className="pt-4" />
                </>
              )}
            </div>
          </CardContent>

          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            {error && (
              <div className="mb-2 p-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </div>
                  <div className="ml-auto pl-3">
                    <button
                      onClick={() => setError(null)}
                      className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <span className="sr-only">Dismiss</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              {/* <Button variant="ghost" size="icon" className="h-8 w-8">
                <Paperclip className="h-4 w-4" />
                <span className="sr-only">Attach file</span>
              </Button> */}
              <Input
                className="flex-1"
                placeholder={isSeller ? 'Reply to the buyer...' : 'Message the seller...'}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!conversationId}
              />
              <Button
                size="sm"
                className="bg-[#088b56] hover:bg-[#077a4b] text-white"
                onClick={() => handleSendMessage()}
                disabled={!message.trim() || !conversationId}
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {quickMessages.map((quickMsg, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handleQuickMessage(quickMsg)}
                  disabled={!conversationId}
                >
                  {quickMsg}
                </Button>
              ))}
            </div>

            <div className="mt-3 bg-primary-500/10 border border-primary-500/20 rounded-lg p-3">
              <div className="flex items-start">
                <Shield className="w-4 h-4 text-primary-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-primary-500 text-xs font-medium">Safety Tips</p>
                  <p className="text-primary-500 text-xs mt-1">
                    Meet in public places, verify items before payment, and report suspicious activity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
