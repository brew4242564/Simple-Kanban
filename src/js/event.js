import {
  addCard,
  addList,
  transferCard,
  switchList,
  switchDeleteMode,
  deleteElement,
  dropLists,
  renameTable,
  sendCardData,
  switchModal,
  UpdateCard,
  renameList,
} from "./logic.js";
import { uiState } from "./state.js";
const nav = document.querySelector(".nav-buttons");
const container = document.querySelector(".container");
const tableName = document.querySelector(".table-name");
const modal = document.querySelector(".modal-layout");

nav.addEventListener("click", (e) => {
  const { action } = e.target.dataset;
  switch (action) {
    case "create-list":
      const title = prompt("Name your new list");
      if (title) addList(title);
      break;
    case "delete":
      switchDeleteMode();
      break;
    case "drop":
      const warn = confirm(
        "This action will remove all lists and their items. Do you want to continue?"
      );
      if (warn) dropLists();
  }
});

tableName.addEventListener("click", (e) => {
  const tableName = prompt("Name your table");
  if (tableName) renameTable(tableName);
});

container.addEventListener("click", (e) => {

  const listId = e.target.closest(".list")?.dataset.id;
  if (!listId) return;

  if (e.target.dataset.action === "create-card") {
    const title = prompt("Name your card");
    if (title) addCard(title, listId);
  }



  const targetElement = e.target.closest("[data-type]");
  if (!targetElement) return;
  const type = targetElement.dataset.type;

  if (uiState.deleteMode) {
    const cardId = targetElement.dataset.id;
    if (type === "card") {
      const warn = confirm("¿Esta seguro de querere eliminar este elemento?");
      if (warn) deleteElement(listId, cardId);
    } else if (type === "list" && e.target.classList.contains("list-header")) {
      const warn = confirm("¿Esta seguro de querere eliminar este elemento?");
      if (warn) deleteElement(listId);
    }
    return;
  }

  if (type === "card") {
    const cardId = targetElement.dataset.id;
    sendCardData(listId, cardId);
  }
  if(e.target.closest(".list-header") && !uiState.deleteMode){
    const title = prompt("Rename your list");
    if (title) renameList(title, listId);
  }
});

container.addEventListener("dragstart", (e) => {
  const targetElement = e.target.closest("[data-type]");
  if (!targetElement) return;
  const type = targetElement.dataset.type;

  if (type === "card") {
    e.dataTransfer.setData("type", "card");
    e.dataTransfer.setData("cardId", e.target.dataset.id);
    e.dataTransfer.setData("fromListId", e.target.closest(".list").dataset.id);
  } else if (type === "list") {
    e.dataTransfer.setData("type", "list");
    e.dataTransfer.setData("listId", e.target.dataset.id);
  }
});

container.addEventListener("dragover", (e) => {
  const list = e.target.closest(".list");
  if (list) {
    e.preventDefault();
  }
});

container.addEventListener("drop", (e) => {
  const type = e.dataTransfer.getData("type");
  const listElement = e.target.closest(".list");
  if (!listElement) return;
  const cardElement = e.target.closest(".card");
  const toListId = listElement.dataset.id;

  if (type === "card") {
    const fromCardId = e.dataTransfer.getData("cardId");
    const fromListId = e.dataTransfer.getData("fromListId");
    const toCardId = cardElement ? cardElement.dataset.id : null;

    transferCard(fromCardId, fromListId, toListId, toCardId);
    return;
  }

  if (type === "list") {
    const fromListId = e.dataTransfer.getData("listId");
    if (toListId !== fromListId) {
      switchList(fromListId, toListId);
    }
  }
});

modal.addEventListener("click", (e) => {
  e.preventDefault();

  const { action } = e.target.dataset;
  
  if (action == "cancel") {
    switchModal();
  }
  if (action == "submit") {
    const form = document.getElementById("form-modal");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    UpdateCard(data, uiState.cardId);
  }
});
