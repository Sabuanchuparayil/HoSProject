cat > src/components/GeminiChat.tsx <<'EOF'
import React, { useState } from "react";

export const GeminiChat: React.FC = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }]);

    // TEMP AI reply — replace with real backend later
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "This is a demo AI reply. Backend integration coming soon!"
        }
      ]);
    }, 700);

    setInput("");
  };

  return (
    <div className="p-5 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Gemini Chat</h2>

      {/* Chat container */}
      <div className="h-80 overflow-y-auto border rounded p-3 mb-3 bg-white">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <strong>{msg.role === "user" ? "You" : "AI"}:</strong>{" "}
            {msg.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-grow border rounded p-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GeminiChat;
EOF

