const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const { query } = JSON.parse(event.body); // user’s text input

    // Call Google Sheet API
    const res = await fetch("https://script.google.com/macros/s/AKfycbwPLuYhYioUz2UoeR4nKHr-62vb3f82Y3bClt7U05HlTj86vGSaeqyL308c9y7J8SPHeQ/exec");
    const data = await res.json();

    // Filter handyman data
    const results = data.filter(h =>
      h.skills?.toLowerCase().includes(query.toLowerCase()) ||
      h.name?.toLowerCase().includes(query.toLowerCase()) ||
      h.address?.toLowerCase().includes(query.toLowerCase())
    );

    if (results.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ reply: "❌ No handyman found for your request." })
      };
    }

    // Pick top match
    const h = results[0];
    const reply = `
✅ I found a handyman for "${query}":

👤 Name: ${h.name}  
🔧 Skill: ${h.skills}  
📍 Address: ${h.address}  
📞 Phone: ${h.phone}  
⭐ Rating: ${h.rating || "No ratings yet"}  
✔ Jobs Completed: ${h.jobs || 0}  

👉 WhatsApp: ${h.whatsapp || "N/A"}
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: "Server error" };
  }
};
