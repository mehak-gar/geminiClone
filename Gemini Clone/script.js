const typingform=document.querySelector(".typing-form");
const chatList=document.querySelector(".chat-list");
let usermessage=null;
// API configuration
const API_KEY = "PASTE-YOUR-API-KEY"; // Your API key here
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
// Create a new message element and return it
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
  }

  
// Fetch response from the API based on user message
const generateAPIResponse = async (incomingMessageDiv) => {
    const textElement = incomingMessageDiv.querySelector(".text"); // Getting text element
    try {
      // Send a POST request to the API with the user's message
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contents: [{ 
            role: "user", 
            parts: [{ text: userMessage }] 
          }] 
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message);
      // Get the API response text and remove asterisks from it
      const apiResponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
      showTypingEffect(apiResponse, textElement, incomingMessageDiv); // Show typing effect
    } catch (error) { // Handle error
      isResponseGenerating = false;
      textElement.innerText = error.message;
      textElement.parentElement.closest(".message").classList.add("error");
    } finally {
      incomingMessageDiv.classList.remove("loading");
    }
  }
  const showLoadingAnimation=()=>{
    const html=`   <div class="message incoming loading">
        <div class="message-content">
            <img src="https://cdn-icons-png.flaticon.com/128/6661/6661011.png" alt="Gemini" class="avatar" />
            <p class="text">
               
            </p>
            <div class="loading-indicator">
                <div class="loading-bar"></div>
                <div class="loading-bar"></div>
                <div class="loading-bar"></div>
            </div>
        </div>`;

          const incomingMessageDiv=  createMessageElement(html,"incoming","loading")
        //   outgoingMessageDiv.querySelector(".text").innerHTML=usermessage
          chatList.appendChild(incomingMessageDiv)
          generateAPIResponse();
  }
const handleOutgoingChat=()=>{
    usermessage=typingform.querySelector(".typing-input").value.trim() || usermessage;
    if(!usermessage) return;
const html=` <div class="message-content">
                  <img src="https://cdn-icons-png.flaticon.com/128/5231/5231020.png" alt="user image" class="avatar" />
                <p class="text">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit,
                    ipsam?
                </p>
            </div>`;

          const outgoingMessageDiv=  createMessageElement(html,"outgoing")
          outgoingMessageDiv.querySelector(".text").innerHTML=usermessage
          chatList.appendChild(outgoingMessageDiv)

          typingform.reset();
          setTimeout(showLoadingAnimation,500)
}

typingform.addEventListener("submit",(e)=>
{
    e.preventDefault()
    console.log('e: ', e);
    handleOutgoingChat();
    
})