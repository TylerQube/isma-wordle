const createPopupMsg = (msg : string) => {
  const popup = document.createElement('div');
  popup.textContent = msg;

  popup.classList.add('popup-msg');
  return popup;
}

const fadeDelayMs = 1500;
const maxChildren = 4;

export const sendPopup = (msg : string) => {
  const popupCont = document.getElementById('popup-cont');
  const popupMsg = createPopupMsg(msg);

  // prevent list from overflowing
  if(popupCont.childElementCount >= maxChildren) {
    popupCont.removeChild(popupCont.children[0]);
  }
  popupCont.insertBefore(popupMsg, popupCont.children[0]);

  setTimeout(() => {
    if(popupMsg.parentElement != null && popupMsg.parentElement == popupCont) {
      popupCont.removeChild(popupMsg);
    }
  }, fadeDelayMs);
}