import { uiState, state } from "./state.js";

const container = document.querySelector(".container");
const tableName = document.querySelector(".table-name");
const modal = document.querySelector(".modal-layout");
const deleteBtn = document.getElementById("delete-btn");

export function renderCards(card) {
  return `
        <div class="card" data-id="${card.id}" draggable="true" data-type="card">
            <h3>${card.title}</h3>
        </div>
    `;
}
export function renderList(list) {
  return ` 
        <div class="list" data-id="${list.id}" draggable="true" data-type="list">
            <h3 class="list-header">${list.title}</h3>
            <div class="card-container">
            ${list.cards.map((card) => renderCards(card)).join("")}
            </div>
            <button class="create-card" data-action="create-card">Add new card</button>
        </div>
    `;
}

export function createModal(card) {
  return `
        <div class="modal-container">
          <form id="form-modal">
            <label for="card-title">Title</label>
            <input
              type="text"
              id="card-title"
              name="title"
              value="${card.title}"
            />

            <label for="content">Description</label>
            <textarea
              name="description"
              id="content"
              placeholder="Enter your description..."
              rows="10"
              >${card.description || ""}</textarea
            >
            <div class="btns-modal">
              <input type="submit" class="btn" data-action="submit" value="Save">
              <button class="btn" data-action = "cancel">Close</button>
            </div>
          </form>
        </div>
    `;
}

export function renderModal(card) {
  if (uiState.modal === true) {
    modal.innerHTML = createModal(card);
    modal.classList.remove("hidden");
  } else {
    modal.classList.add("hidden");
  }
}

export function render() {
  if (uiState.deleteMode) {
    container.classList.add("delete-mode");
    deleteBtn.classList.add("delete-mode");
  } else {
    container.classList.remove("delete-mode");
    deleteBtn.classList.remove("delete-mode");
  }
  const allLists = state.lists.map((list) => renderList(list)).join("");
  container.innerHTML = allLists;
  renderTableName();
}

export function renderTableName() {
  tableName.innerHTML = state.name;
}
