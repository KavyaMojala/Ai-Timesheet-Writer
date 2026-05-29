import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/messages", async (req, res) => {
  try {
    const ollamaMessages = (req.body.messages || []).map(msg => {
      let contentStr = "";
      if (typeof msg.content === "string") {
        contentStr = msg.content;
      } else if (Array.isArray(msg.content)) {
        contentStr = msg.content
          .filter(block => block.type === "text")
          .map(block => block.text)
          .join("\n");
      }
      return {
        role: msg.role,
        content: contentStr
      };
    });

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemma4:e2b",
        messages: ollamaMessages,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Map response back to Anthropic's expected format
    res.json({
      id: `msg_local_${Date.now()}`,
      type: "message",
      role: "assistant",
      content: [
        {
          type: "text",
          text: data.message.content,
        }
      ],
      model: "gemma4:e2b",
      stop_reason: "end_turn",
      stop_sequence: null,
      usage: {
        input_tokens: 0,
        output_tokens: 0,
      }
    });
  } catch (error) {
    console.error("Error connecting to Ollama:", error);
    res.status(500).json({
      error: {
        type: "api_error",
        message: error.message,
      }
    });
  }
});

app.listen(3001, () => console.log("Proxy running on http://localhost:3001"));