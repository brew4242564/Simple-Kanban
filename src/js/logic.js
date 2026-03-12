import { state, uiState, saveState } from "./state.js";
import { render, renderTableName, renderModal } from "./render.js";
if(state.lists.length === 0){
  addList("To-Do");
  addList("In Progress");
  addList("Completed");
}
export function createList(title) {
  return {
    id: crypto.randomUUID(),
    title,
    cards: [],
  };
}

export function createCard(title) {
  return {
    id: crypto.randomUUID(),
    title,
    description: "",
  };
}

export function addList(title) {
  state.lists.push(createList(title));
  saveState();
  render();
}

export function addCard(title, listid) {
  state.lists
    .find((lists) => lists.id === listid)
    .cards.push(createCard(title));
  saveState();
  render();
}

export function switchList(fromListId, toListId) {
  const fromListIndex = state.lists.findIndex((l) => l.id === fromListId);
  const toListIndex = state.lists.findIndex((l) => l.id === toListId);

  [state.lists[fromListIndex], state.lists[toListIndex]] = [
    state.lists[toListIndex],
    state.lists[fromListIndex],
  ];
  saveState();
  render();
}

export function transferCard(fromCardId, fromListId, toListId, toCardId) {
  const fromList = state.lists.find((l) => l.id === fromListId);
  const toList = state.lists.find((l) => l.id === toListId);

  const fromIndex = fromList.cards.findIndex((c) => c.id === fromCardId);
  const [movedCard] = fromList.cards.splice(fromIndex, 1);

  const toIndex = toList.cards.findIndex((c) => c.id === toCardId);

  if (toIndex !== -1) {
    toList.cards.splice(toIndex, 0, movedCard);
  } else {
    toList.cards.push(movedCard);
  }
  saveState();
  render();
}

export function switchDeleteMode() {
  uiState.deleteMode = !uiState.deleteMode;
  saveState();
  render();
}

export function deleteElement(listId, cardId) {
  const listIndex = state.lists.findIndex((l) => l.id === listId);
  if (!cardId) {
    state.lists.splice(listIndex, 1);
  } else {
    const targetList = state.lists[listIndex];
    const cardIndex = targetList.cards.findIndex(
      (c) => String(c.id) === String(cardId),
    );

    if (cardIndex !== -1) {
      targetList.cards.splice(cardIndex, 1);
    } 
  }
  saveState();
  render();
}


export function dropLists(){
  state.lists = [];
  saveState();
  render();
}

export function renameTable(tableName){
  state.name = tableName;
  renderTableName();
  saveState();
}

// funcion para debug
// function fill(){
//   for (let index = 0; index < 20; index++) {
//     addCard(`${index}`, state.lists[0].id);
//   }
// }

export function sendCardData(listId, cardId){
    const listElement = state.lists.find((l) => l.id === listId);
    const card = listElement.cards.find((c) => c.id === cardId);
    uiState.modal = true;
    uiState.cardId = card;
    // esto necesita un refactor, en lugar de utilizar card, 
    // directamente usar uiState en el render, y dejar renderModal sin parametros
    renderModal(card);
}

export function switchModal(){
  uiState.modal = !uiState.modal;
  renderModal();
}

export function UpdateCard(data, cardId){
  cardId.title = data.title;
  cardId.description = data.description;
  saveState();
  switchModal();
  render();
}

export function renameList(title, listId){
  const listElement = state.lists.find((l)=> l.id === listId);
  listElement.title = title;
  render();
}

render();