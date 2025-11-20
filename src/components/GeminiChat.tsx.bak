import React, { useState } from "react";

export const GeminiChat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, `You: ${input}`]);

    // Placeholder response — replace with your API logic later
    setMessages((prev) => [...prev, `Gemini: Response for "${input}"`]);

    setInput("");
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">Gemini Chat</h2>

      <div className="h-64 overflow-y-auto border p-2 mb-3 bg-gray-50">
        {messages.map((msg, i) => (
          <p key={i} className="text-sm mb-1">
            {msg}
          </p>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Type your message..."
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
o
import React, { useState } from "react";

export const GeminiChat = () => {
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

      {/* Chat Box */}
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
import React, { useState } from "react";

export const GeminiChat = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { role: "user", content: input }]);

    // Placeholder AI response — replace with your API:
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "This is a sample AI response. Connect backend later."
        }
      ]);
    }, 800);

    setInput("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gemini Chat</h2>

      <div
        style={{
          height: 300,
          overflowY: "auto",
          border: "1px solid #ddd",
          padding: 10,
          marginBottom: 10
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <b>{msg.role === "user" ? "You" : "AI"}:</b> {msg.content}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type a message..."
        style={{ width: "80%", padding: 8 }}
      />
      <button onClick={sendMessage} style={{ padding: 8, marginLeft: 8 }}>
        Send
      </button>
    </div>
  );
};

export default GeminiChat;

