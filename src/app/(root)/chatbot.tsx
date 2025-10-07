import { useEffect, useRef } from "react";
import { useChat } from "ai/react";
import Image from "next/image";


const Chatbot = () => {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: "/api/openai"
    });

    const chatContainer = useRef<HTMLDivElement>(null);

    const scroll = () => {
        const {offsetHeight, scrollHeight, scrollTop} = chatContainer.current as HTMLDivElement;
        if (scrollHeight >= offsetHeight + scrollTop ) {
            chatContainer.current?.scrollTo(0, scrollHeight + 200)
        }
    }

    useEffect(() => {
        scroll();
    }, [messages]);

    const renderResponse = () => {
        return (
            <div className="response">
                {messages.map((m, index) => (
                    <div key={m.id} className={`chat-line ${m.role === "user" ? "user-chat" : "ai-chat"}`}>
                        <Image className="avatar" src={m.role === "user" ? "/user.png" : "/ai.png"} alt={m.role} />
                        <div style={{ width: "100%", marginLeft: "16px" }}>
                            <p className="message">{m.content}</p>
                            {index < messages.length - 1 && <div className="horizontal-line"></div>}

                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div ref={chatContainer} className="chat">
            {renderResponse()}
            <form onSubmit={handleSubmit} className="mainForm">
                <input
                    type="text"
                    name="input-field"
                    placeholder="Type your message..."
                />
                <button type="submit" className="mainButton">Send</button>
            </form>
        </div>
    );
}