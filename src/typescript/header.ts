import { openModal, closeModal, showTutorialModal } from "./modal";

export const setupIcons = () => {
  document.getElementById('stats-icon').addEventListener('click', () => {
    openModal();
  });

  document.getElementById('tutorial-icon').addEventListener('click', showTutorialModal);
};