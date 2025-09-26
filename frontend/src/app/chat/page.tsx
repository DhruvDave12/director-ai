"use client"

import { useMemo, useState } from "react"
import { Plus, Send, MessageSquare, User, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

type Message = { id: string; role: "user" | "assistant"; content: string }

type Chat = { id: string; title: string }

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([
    { id: "1", title: "Welcome" },
    { id: "2", title: "Design ideas" },
  ])
  const [activeChatId, setActiveChatId] = useState<string>("1")
  const [messagesByChat, setMessagesByChat] = useState<Record<string, Message[]>>({
    "1": [
      { id: "m1", role: "assistant", content: "Hi! How can I help today?" },
    ],
    "2": [
      { id: "m2", role: "assistant", content: "Share your design goals." },
    ],
  })
  const [input, setInput] = useState("")

  const activeMessages = useMemo(() => messagesByChat[activeChatId] ?? [], [messagesByChat, activeChatId])
  const activeChat = useMemo(() => chats.find(c => c.id === activeChatId), [chats, activeChatId])

  function onNewChat() {
    const id = Date.now().toString()
    const title = "New Chat"
    setChats(prev => [{ id, title }, ...prev])
    setMessagesByChat(prev => ({ ...prev, [id]: [] }))
    setActiveChatId(id)
  }

  function onSend() {
    const text = input.trim()
    if (!text) return
    const id = Date.now().toString()
    setMessagesByChat(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] ?? []), { id, role: "user", content: text }],
    }))
    setInput("")
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="overflow-hidden">
        <SidebarHeader>
          <div className="flex items-center gap-3 px-2 py-3">
            <h1 className="font-semibold text-lg group-data-[collapsible=icon]:hidden">EthDelhi Hack</h1>
          </div>
          <div className="px-2 pb-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <Button
              onClick={onNewChat}
              className="w-full justify-start gap-2 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
            >
              <Plus className="size-4" />
              <span className="group-data-[collapsible=icon]:hidden">New chat</span>
            </Button>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="px-2 py-2 text-sm font-medium group-data-[collapsible=icon]:hidden">
              Recents
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {chats.map(chat => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton
                      isActive={chat.id === activeChatId}
                      onClick={() => setActiveChatId(chat.id)}
                      tooltip={chat.title}
                      className="group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto"
                    >
                      <MessageSquare className="size-4" />
                      <span className="truncate group-data-[collapsible=icon]:hidden">{chat.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto">
                <div className="flex items-center gap-2 min-w-0 flex-1 group-data-[collapsible=icon]:flex-none">
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="size-4" />
                  </div>
                  <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-medium truncate">Aditya</span>
                    <span className="text-xs text-muted-foreground">Free plan</span>
                  </div>
                </div>
                <ChevronUp className="size-4 group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <div className="flex h-14 items-center gap-2 border-b px-3">
          <SidebarTrigger className="md:hidden" />
          <div className="font-medium">{activeChat?.title ?? "Chat"}</div>
        </div>

        <div className="flex flex-1 min-h-0">
          <div className="flex w-full flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mx-auto w-full max-w-3xl space-y-4">
                {activeMessages.map(m => (
                  <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                    <div
                      className={
                        m.role === "user"
                          ? "bg-primary text-primary-foreground rounded-xl px-3 py-2 max-w-[85%]"
                          : "bg-muted text-foreground rounded-xl px-3 py-2 max-w-[85%]"
                      }
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t p-3">
              <form
                className="mx-auto flex w-full max-w-3xl items-end gap-2"
                onSubmit={e => {
                  e.preventDefault()
                  onSend()
                }}
              >
                <Textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type a message..."
                  rows={2}
                  className="min-h-10"
                />
                <Button type="submit" size="icon" className="h-10 w-10" aria-label="Send">
                  <Send className="size-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
