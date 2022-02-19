import { openModal, closeModal } from "./modal";

export const setupIcons = () => {
  document.getElementById('stats-icon').addEventListener('click', () => {
    openModal();
  });
};