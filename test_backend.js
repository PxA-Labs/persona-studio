const axios = require('axios');

async function test() {
  try {
    const response = await axios.post(
      "https://purvansh01-persona-studio.hf.space/api/generate",
      { prompt: "beautiful test image", negative_prompt: "ugly" },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("SUCCESS:", response.status);
  } catch (e) {
    if (e.response) {
      console.error("SERVER RETURNED:", e.response.status);
      console.error("DATA:", e.response.data);
    } else {
      console.error("NETWORK ERROR:", e.message);
    }
  }
}
test();
