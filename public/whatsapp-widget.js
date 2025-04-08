(function () {
  const styleTag = `
        <style>
            #chat-widget {
                position: fixed;
                bottom: 24px;
                left: 24px;
                display: flex;
                margin-left:16px;
                z-index: 999999999 !important;
            }
            #btn-trigger-chat {
                box-sizing: border-box;
                margin-left: auto;
                margin-top: auto;
                display: inline-flex;
                height: 52px;
                width: 52px;
                align-items: center;
                justify-content: center;
                border-radius: 9999px;
                color: white;
                cursor: pointer;
                background-color: #25d366;
                border-style: none;
                padding: 0.30rem;
            }
            #close {
              display: flex;
              justify-content: flex-end;
              width: 14px;
              height: 14px;
              color: white;
              border: none;
              background: transparent;
              cursor:pointer;
            }
            #title-form {
              font-weight: 600;
              padding-left: 16px;
              padding-right: 16px;
              width: 100%;
              font-size: 1.25rem /* 20px */;
              line-height: 125%;
              color: white;
            }
            #chat-frame-widget {
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 300px;
              border-top-left-radius: 0.5rem /* 8px */;
              border-top-right-radius: 0.5rem /* 8px */;
              border: none;
              position: fixed;
              inset: auto auto 24px 24px;
              max-width: 320px;
              height: 495px;
              opacity: 1;
              color-scheme: none;
              margin: 0 16px;
              max-height: 495px;
              transform: translateY(0px);
              transition: none 0s ease 0s !important;
              visibility: visible;
              z-index: 999999999 !important;
              border-radius: 0.5rem;
            }
            .whatsapp {
                box-sizing: border-box;
                margin-left: auto;
                margin-top: auto;
                display: inline-flex;
                height: 2rem;
                width: 2rem;
                align-items: center;
                justify-content: center;
                border-radius: 9999px;
                color: white;
                background-color: #25d366;
                border-style: none;
                padding: 0.30rem;
            }
            .h-7 {
                height: 1.75rem;
            }
            .w-7 {
                width: 1.75rem;
            }
            .h-8 {
                height: 2rem;
            }
            .w-8 {
                width: 2rem;
            }
            .rounded-full {
                border-radius: 50%;
            }
            .bg-dark-green {
              background: #128c7e
            }
            .bg-light-green {
              background: #25d366
            }
            .flex-col {
              flex-direction: column;
            }
            .items-center {
              align-items: center;
            }
            .w-full {
              width: 100%
            }
            .py-3 {
              padding-top: 0.75rem;
              padding-bottom: 0.75rem;
            }
            .px-6 {
              padding-left: 1.5rem;
              padding-right: 1.5rem;
            }
            .text-surface-0 {
              color: #ffffff;
            }
            .shadow-xl {
                --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
                --tw-ring-shadow: 0 0 #0000;
                --tw-shadow-colored: 0 0 #0000;
                --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
                    0 8px 10px -6px rgb(0 0 0 / 0.1);
                --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color),
                    0 8px 10px -6px var(--tw-shadow-color);
                box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
                    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
            }
            .ring-1 {
                --tw-ring-color: rgb(17 24 39 / 0.05);
                --tw-ring-shadow: 0 0 #0000;
                --tw-ring-offset-color: #fff;
                --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
                    var(--tw-ring-offset-width) var(--tw-ring-offset-color);
                --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
                    calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
                box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
                    var(--tw-shadow, 0 0 #0000);
            }
        </style>
    `;

  function initWidget(whatsapp_phone, source, base_url) {    
    const chatWidget = document.createElement("div");
    chatWidget.id = "chat-widget";
    chatWidget.innerHTML = `
      <div id="chat-frame-widget" class="shadow-xl">
        <div class="bg-dark-green" style="height:60px; max-width: 320px; min-width:200px; width:100% ;display: flex; align-items: center; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; padding: 0 16px; justify-content: space-between;">
          <span class="rounded-full bg-light-green" style="height: 2rem; width: 2rem;">
            <svg class="whatsapp" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.0205 3.5C11.385 3.5 3.5411 11.3372 3.5376 20.9727C3.53585 24.0527 4.34257 27.0595 5.87207 29.709L3.5 38.5L12.6567 36.3364C15.21 37.7294 18.0843 38.4607 21.0103 38.4624H21.0171C30.6508 38.4624 38.4913 30.6235 38.4966 20.9897C38.5001 16.319 36.6838 11.9275 33.3833 8.62354C30.0828 5.32129 25.6965 3.50175 21.0205 3.5ZM21.0171 7C24.7551 7.00175 28.2679 8.45914 30.9087 11.0981C33.5494 13.7406 35.0001 17.2518 34.9966 20.9863C34.9931 28.6933 28.7242 34.9624 21.0137 34.9624C18.6809 34.9607 16.3702 34.3749 14.335 33.2637L13.1558 32.6211L11.8535 32.9287L8.4082 33.7422L9.24902 30.6182L9.62842 29.2168L8.90381 27.959C7.68231 25.845 7.03585 23.4279 7.0376 20.9727C7.0411 13.2692 13.3118 7 21.0171 7ZM14.834 12.9062C14.5417 12.9062 14.0692 13.0156 13.6685 13.4531C13.2677 13.8889 12.1372 14.9443 12.1372 17.0933C12.1372 19.2423 13.7026 21.3196 13.9214 21.6118C14.1384 21.9023 16.9431 26.4517 21.3828 28.2017C25.0718 29.6559 25.8211 29.3689 26.6226 29.2954C27.4241 29.2237 29.2083 28.241 29.5723 27.2207C29.9363 26.2005 29.9371 25.3228 29.8286 25.1426C29.7201 24.9606 29.4287 24.8521 28.9912 24.6333C28.5555 24.4146 26.4081 23.3601 26.0073 23.2148C25.6066 23.0696 25.3134 22.9961 25.0229 23.4336C24.7324 23.8711 23.8976 24.8521 23.6421 25.1426C23.3866 25.4348 23.1328 25.4741 22.6953 25.2554C22.2578 25.0349 20.8511 24.5725 19.1816 23.085C17.8831 21.9282 17.007 20.501 16.7515 20.0635C16.4977 19.6277 16.7275 19.3884 16.9463 19.1714C17.1423 18.9754 17.3804 18.6613 17.5991 18.4058C17.8161 18.1503 17.8914 17.9682 18.0366 17.6777C18.1819 17.3872 18.1075 17.1309 17.999 16.9121C17.8905 16.6934 17.0408 14.5364 16.6523 13.6719C16.3251 12.9456 15.9795 12.9288 15.668 12.9165C15.4142 12.906 15.1245 12.9062 14.834 12.9062Z" fill="white"/>
            </svg>
          </span>
          <h2 id="title-form" style="font-weight: 600; padding-left: 16px; padding-right: 16px; width: 100%; font-size: 1.25rem; line-height: 125%; color: white;">WhatsApp</h2>
          <button id="close" >
            <svg fill="white" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 371.23 371.23" style="enable-background:new 0 0 371.23 371.23;" xml:space="preserve">
              <polygon points="371.23,21.213 350.018,0 185.615,164.402 21.213,0 0,21.213 164.402,185.615 0,350.018 21.213,371.23 185.615,206.828 350.018,371.23 371.23,350.018 206.828,185.615 "/>
            </svg>
          </button>
        </div>
        <iframe id="iframe" src="${base_url}/whatsapp-form-page/?phone=${whatsapp_phone}&${window.location.search.substring(1)}&source=Widget WhatsApp ${source}" style="  width: 300px; min-width:200px; max-width:320px; height: -webkit-fill-available;height:100%; opacity: 1; color-scheme: none; background: white !important; margin: 0px; max-height: -webkit-fill-available; max-height:-moz-available; z-index: 999999999 !important; border-bottom-left-radius: 0.5rem; border-bottom-right-radius: 0.5rem;padding-right: 16px;padding-left: 16px; border:none;"></iframe>
      </div>
      <button id="btn-trigger-chat">
        <svg class="text-surface-0 h-9 w-9" width="100%" height="100%" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.0205 3.5C11.385 3.5 3.5411 11.3372 3.5376 20.9727C3.53585 24.0527 4.34257 27.0595 5.87207 29.709L3.5 38.5L12.6567 36.3364C15.21 37.7294 18.0843 38.4607 21.0103 38.4624H21.0171C30.6508 38.4624 38.4913 30.6235 38.4966 20.9897C38.5001 16.319 36.6838 11.9275 33.3833 8.62354C30.0828 5.32129 25.6965 3.50175 21.0205 3.5ZM21.0171 7C24.7551 7.00175 28.2679 8.45914 30.9087 11.0981C33.5494 13.7406 35.0001 17.2518 34.9966 20.9863C34.9931 28.6933 28.7242 34.9624 21.0137 34.9624C18.6809 34.9607 16.3702 34.3749 14.335 33.2637L13.1558 32.6211L11.8535 32.9287L8.4082 33.7422L9.24902 30.6182L9.62842 29.2168L8.90381 27.959C7.68231 25.845 7.03585 23.4279 7.0376 20.9727C7.0411 13.2692 13.3118 7 21.0171 7ZM14.834 12.9062C14.5417 12.9062 14.0692 13.0156 13.6685 13.4531C13.2677 13.8889 12.1372 14.9443 12.1372 17.0933C12.1372 19.2423 13.7026 21.3196 13.9214 21.6118C14.1384 21.9023 16.9431 26.4517 21.3828 28.2017C25.0718 29.6559 25.8211 29.3689 26.6226 29.2954C27.4241 29.2237 29.2083 28.241 29.5723 27.2207C29.9363 26.2005 29.9371 25.3228 29.8286 25.1426C29.7201 24.9606 29.4287 24.8521 28.9912 24.6333C28.5555 24.4146 26.4081 23.3601 26.0073 23.2148C25.6066 23.0696 25.3134 22.9961 25.0229 23.4336C24.7324 23.8711 23.8976 24.8521 23.6421 25.1426C23.3866 25.4348 23.1328 25.4741 22.6953 25.2554C22.2578 25.0349 20.8511 24.5725 19.1816 23.085C17.8831 21.9282 17.007 20.501 16.7515 20.0635C16.4977 19.6277 16.7275 19.3884 16.9463 19.1714C17.1423 18.9754 17.3804 18.6613 17.5991 18.4058C17.8161 18.1503 17.8914 17.9682 18.0366 17.6777C18.1819 17.3872 18.1075 17.1309 17.999 16.9121C17.8905 16.6934 17.0408 14.5364 16.6523 13.6719C16.3251 12.9456 15.9795 12.9288 15.668 12.9165C15.4142 12.906 15.1245 12.9062 14.834 12.9062Z" fill="white"/>
        </svg>
      </button>
    `;

    document.head.insertAdjacentHTML("beforeend", styleTag);
    document.body.appendChild(chatWidget);

    const btn = document.getElementById("btn-trigger-chat");
    const closebtn = document.getElementById("close");
    const frameWidget = document.getElementById("chat-frame-widget");
    frameWidget.style.display = "none";
    btn.addEventListener("click", () => {
        frameWidget.style.display = "flex";
    });
    closebtn.addEventListener("click", () => {
        frameWidget.style.display = "none";
    });
    window.addEventListener("message", function (e) {
      if (e.data && e.data.event === "whatsapp_lead") {
        console.log(e.data);
        window.dataLayer.push(e.data);
      }
    });
  }

  window.ChatWidget = {
    init: initWidget,
  };
})();

