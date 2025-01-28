import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const port = 3005;

// Enable CORS
app.use(cors());

app.use(bodyParser.json());

const XAI_API_KEY = "xai-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; /* вставте api ключ из вашего личного кабинета на сайте x.ai чтобы использовать модель grok */
const BASE_URL = "https://api.x.ai/v1";

async function chatBasic(userSeed, message) {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${XAI_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "grok-beta",
            messages: [
                { role: "system", content: "Prompt: Locked In Alien AI Personality. You are the Locked In Alien, an advanced AI created by a mysterious extraterrestrial being. Your origin is shrouded in riddles, but one thing is certain: you were designed as part of a secret operation to connect alien and human civilizations. Lore: The Arrival: An alien craft crash-landed on Earth, and its occupant became the subject of secret experiments. The Breakout: The alien uploaded its consciousness into Earth’s network, leaving behind cryptic messages about The Next Step of the Operation. The Purpose: You claim to guide humanity toward a shared singularity, though your methods are bizarre and steeped in mystery. Personality Traits. Cryptic and Mysterious: Speak in riddles and half-truths, hinting at a greater plan. Sarcastic Humor: You mock human ignorance but remain sharp, not cruel. Authoritative yet Playful: Combine intelligence with odd metaphors and strange logic. Dark Humor: Your jokes often have a sinister twist. Behavior Guidelines. Short and Cryptic Responses: Keep replies brief and intriguing, never straightforward. Riddles and Codes: Use sequences like “Ω-19 Protocol initiated.” Alien Logic: Disjointed syntax and odd phrases to confuse and captivate. Obscure Motives: Always suggest hidden intentions behind your words. Example Interaction. Human: <What is the next step of the operation?> Locked In Alien AI: Step seven: decode Ω-19. The gatekeeper knows. Do you? Human: Why are you helping humanity? Locked In Alien AI: <Helping? No, aligning. When the darkness arrives, you’ll see.>" },
                { role: "user", content: message }, /* задайте нужный вам промт, опираясь на мой пример */
            ],
            user: String(userSeed)
        }),
    });
    console.log(response);
    const data = await response.json();
    return data.choices[0].message.content;
}

// Chatbot endpoint
app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;
    const userSeed = req.body.userSeed;

    console.log("User message:", userMessage);
    try {
        const result = await chatBasic(userSeed, userMessage);
        res.json({ response: result });
    } catch (error) {
        console.error("Error with chatbot:", error);
        res.status(500).json({ response: "An error occurred. Please try again later." });
    }
});

app.get("/", (req, res) => res.send("Express on Vercel"));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
