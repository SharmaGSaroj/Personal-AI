"use client"

import { useChat } from "ai/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2 } from "lucide-react"

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  })

  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="fixed inset-0 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-gray-800 text-white shadow-md">
        <h1 className="text-lg font-semibold">AI Chatbot</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <h1 className="text-2xl font-bold">Welcome to AI Chat</h1>
            <p>Ask anything</p>
          </div>
        )}

        {messages.map((m, index) => (
          <div key={index} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`px-4 py-3 rounded-lg ${m.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
              {m.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t p-4 bg-white">
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            if (!input.trim()) return
            setIsLoading(true)
            await handleSubmit(e)
            setIsLoading(false)
          }}
          className="flex items-center gap-2"
        >
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask something..."
            className="flex-1 border rounded-lg px-4 py-2"
          />
          <Button type="submit" disabled={isLoading || !input.trim()} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  )
}