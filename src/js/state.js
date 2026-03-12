export const state = {
    name: "Click to rename table",
    lists: [],
}

const saveData = localStorage.getItem("stateData");

if (saveData){
  Object.assign(state, JSON.parse(saveData))
}

export function saveState(){
  localStorage.setItem("stateData", JSON.stringify(state));
}

export const uiState = {
    deleteMode: false,
    modal: false,
    cardId: "",
}

