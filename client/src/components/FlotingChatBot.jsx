import { useState } from "react";
import { MessageCircle } from "lucide-react";
import Chatbot from "./Chatbot";

const FloatingChatBot = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 z-50 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all duration-300"
        title="Open Health Assistant"
      >
        <MessageCircle size={22} />
        <span className="hidden md:inline font-semibold text-sm">
          Ask MedBot
        </span>
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 w-[95vw] md:w-[400px] h-[550px] z-50 rounded-lg shadow-xl overflow-hidden animate-fade-in">
          <Chatbot />
        </div>
      )}
    </>
  );
};

export default FloatingChatBot;
