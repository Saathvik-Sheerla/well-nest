let chatBtn = document.getElementById('chat-btn');
let chat = document.getElementsByClassName('chat-div');
let isOpen = false;

chatBtn.addEventListener('click', ()=>{
    if(isOpen){
        isOpen = false;
        chat.style.display = 'none';
        console.log('closed');
    } else {
        isOpen = true;
        chat.style.display = 'block';
        console.log('opened');
    }
})