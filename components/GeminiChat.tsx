const initializeChat = async () => {
    setIsLoading(true);
    try {
        // Dynamically import the correct package
        const { GoogleGenerativeAI } = await import("@google/generative-ai");

        const apiKey = process.env.API_KEY;
        if (!apiKey) throw new Error("API Key is missing.");

        aiRef.current = new GoogleGenerativeAI(apiKey);

        const systemInstruction =
            "You are the 'House of Spells Oracle,' a friendly and knowledgeable magical assistant. Your purpose is to help users find products, answer questions about the wizarding world and other fandoms like Lord of the Rings, and provide a fun, immersive shopping experience.";

        const model = aiRef.current.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction,
        });

        chatRef.current = model.startChat();

        const initialMessage =
            proactiveMessage ||
            "Greetings! I am the House of Spells Oracle. Ask me about our magical wares.";

        setMessages([{ role: "model", text: initialMessage }]);

        if (proactiveMessage) clearProactiveMessage();
    } catch (error) {
        console.error("Failed to initialize Gemini:", error);
        setMessages([
            {
                role: "model",
                text: "The Oracle is currently unavailable. Please try again later.",
            },
        ]);
    } finally {
        setIsLoading(false);
    }
};
