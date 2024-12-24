const typingform=document.querySelector(".typing-form");
const chatList=document.querySelector(".chat-list");
const toggleThemeButton=document.querySelector("#toggle-theme-button");
const deleteChatButton=document.querySelector("#delete-chat-button");
const suggestions=document.querySelectorAll(".suggestion-list .suggestion")
let userMessage=null;
let responseIsGenerating=false
// API configuration
const API_KEY = "sfds"; // Your API key here
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

const loadLocalStorageData=()=>{
  const savedChats=localStorage.getItem("savedChats")
  const isLightMode= (localStorage.getItem("themecolor")=== "light_mode")
  // Apply the stored theme
  document.body.classList.toggle("light_mode",isLightMode)
  toggleThemeButton.innerText=isLightMode ? "dark_mode" : "light_mode";
  
  chatList.innerHTML=savedChats || "";
  document.body.classList.toggle("hide-header",savedChats)
  chatList.scrollTo(0,chatList.scrollHeight)
}
loadLocalStorageData()

// Create a new message element and return it
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
  }
  // showing effect by typing one by one
const showTypingEffect=(text,textElement,incomingMessageDiv)=>{
  const words= text.split(' ')
  let currentWordIndex=0; 
  const typingInterval=setInterval(()=>{
    //Append  Each Elemnet in Text With Space
    textElement.innerText+=(currentWordIndex===0 ? '' : ' ')+words[currentWordIndex++]
    incomingMessageDiv.querySelector(".icon").classList.add("hide")
    // if all words are displayed
    if(currentWordIndex === words?.length){
      clearInterval(typingInterval)
      responseIsGenerating=false
      incomingMessageDiv.querySelector(".icon").classList.remove("hide")
      localStorage.setItem("savedChats",chatList.innerHTML) //save chats to local storage
    }
    chatList.scrollTo(0,chatList.scrollHeight)
  },75)

}
  
// // Fetch response from the API based on user message
const generateAPIResponse = async (incomingMessageDiv) => {
     const textElement = incomingMessageDiv.querySelector(".text"); // Getting text element
     console.log('textElement: ', textElement);
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
     
      const apiResponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
      // textElement.innerText=apiResponse;
      console.log('apiResponse: ', apiResponse);
       showTypingEffect(apiResponse, textElement, incomingMessageDiv); // Show typing effect
    } catch (error) { // Handle error
      responseIsGenerating=false
      textElement.innerText=error.message
      textElement.classList.add("error")     
    } finally {
      incomingMessageDiv.classList.remove("loading");
    }
    
  }

const handleOutgoingChat=()=>{
  userMessage=typingform.querySelector(".typing-input").value.trim() || userMessage;
    if(!userMessage || responseIsGenerating) return;
    responseIsGenerating=true
const html=` <div class="message-content">
                  <img src="https://cdn-icons-png.flaticon.com/128/5231/5231020.png" alt="user image" class="avatar" />
                <p class="text">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit,
                    ipsam?
                </p>
            </div>`;

          const outgoingMessageDiv=  createMessageElement(html,"outgoing")
          outgoingMessageDiv.querySelector(".text").innerHTML=userMessage
          chatList.appendChild(outgoingMessageDiv)

          typingform.reset();
          chatList.scrollTo(0,chatList.scrollHeight)
          document.body.classList.add("hide-header")
          setTimeout(showLoadingAnimation,500)
}
suggestions.forEach((suggestion)=>{
  suggestion.addEventListener("click",()=>{
    userMessage=suggestion.querySelector(".text").innerText
    handleOutgoingChat();
  })
})
// Toggle Between light and dark theme
toggleThemeButton.addEventListener("click",()=>{
  const isLightMode=document.body.classList.toggle("light_mode")
  localStorage.setItem("themecolor",isLightMode ? "light_mode" : "dark_mode")
  toggleThemeButton.innerText=isLightMode ? "dark_mode" : "light_mode"
})

deleteChatButton.addEventListener("click",()=>{
  if(confirm("Are you Sure You Want To Delete Messages?"))
  {
    localStorage.removeItem("savedChats")
    loadLocalStorageData()
  }
})
typingform.addEventListener("submit",(e)=>
{
    e.preventDefault()
    
    handleOutgoingChat();
    
})



const showLoadingAnimation = () => {
  const html = `
      <div class="message-content">
          <img src="https://cdn-icons-png.flaticon.com/128/6661/6661011.png" alt="Gemini" class="avatar" />
          <p class="text"></p>
          <div class="loading-indicator">
              <div class="loading-bar"></div>
              <div class="loading-bar"></div>
              <div class="loading-bar"></div>
          </div>
      </div>
      <span onclick="copyMessage(this)" class="icon material-symbols-rounded"> content_copy </span> `;
  const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
  chatList.appendChild(incomingMessageDiv);
  chatList.scrollTo(0,chatList.scrollHeight)
  generateAPIResponse(incomingMessageDiv);
};
//copy message to text clipboard
const copyMessage=(copyIcon)=>{
  const MessageText=copyIcon.parentElement.querySelector(".text").innerText;
  navigator.clipboard.writeText(MessageText);
  copyIcon.innerText="done";
  setTimeout(()=>{copyIcon.innerText="content_copy";},1000) //revert icon after one second
}




