import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { GEMINI_API_KEY, GEMINI_API_URL } from "../App";
function Chatbot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  const generateAnswer = async (e) => {
    e.preventDefault();
    setGeneratingAnswer(true);
    setAnswer("⏳ Loading your answer...\nIt might take up to 10 seconds.");

    try {
      const response = await axios.post(
       `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
contents: [
  {
    parts: [
      {
        text: `
You are an expert medical assistant. Understand and interpret user queries about medicines, symptoms, side effects, or treatments — even if they contain spelling mistakes or incomplete information.

Always respond clearly and concisely. If you recognize a medicine name that is misspelled, correct it and give the right information.

Question: ${question}
        `.trim()
      }
    ]
  }
]
        }
      );

      const reply =
        response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No answer";
      setAnswer(reply);
    } catch (err) {
      console.error(err);
      setAnswer("❌ Sorry, something went wrong. Please try again.");
    }

    setGeneratingAnswer(false);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen flex flex-col items-center justify-center p-4">
      <form
        onSubmit={generateAnswer}
        className="bg-white rounded-lg shadow-xl w-full max-w-xl p-6 space-y-4 transition-all duration-300 hover:scale-[1.01]"
      >
        <h1 className="text-3xl font-bold text-blue-600 text-center">
          💊 TrackMeds AI Assistant
        </h1>
        <textarea
          required
          className="w-full border rounded-md p-3 h-32 resize-none focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Ask about any medicine or health-related issue..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        ></textarea>
        <button
          type="submit"
          disabled={generatingAnswer}
          className={`w-full py-3 font-semibold rounded-md text-white transition-all duration-300 ${
            generatingAnswer
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {generatingAnswer ? "Generating..." : "Get Answer"}
        </button>
      </form>

      <div className="w-full max-w-xl bg-white mt-6 rounded-lg shadow-md p-4 h-60 overflow-y-auto">
  <div className="prose">
    <ReactMarkdown>{answer}</ReactMarkdown>
  </div>
</div>


      <p className="text-xs text-gray-500 mt-2 text-center max-w-xl">
        ⚠️ This AI provides general health and medicine info. Always consult a
        licensed doctor before taking action based on these answers.
      </p>
    </div>
  );
}

export default Chatbot;
