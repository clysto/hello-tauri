import './style.css';
import { listen } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/api/dialog';
import { readBinaryFile } from '@tauri-apps/api/fs';
import { appWindow, PhysicalSize } from '@tauri-apps/api/window';

appWindow.setMinSize(new PhysicalSize(400, 500));

const state = {
  currentOpenFile: undefined,
};

document.querySelector('#open').addEventListener('click', async () => {
  state.currentOpenFile = await open();
  loadFile();
});

listen('tauri://menu', async (event) => {
  if (event.payload === 'open') {
    state.currentOpenFile = await open();
    loadFile();
  }
});

function charCode(code) {
  const ret = String.fromCharCode(code);
  if (ret.match(/^[\x00-\x7F]$/) && !ret.match(/^\s$/)) {
    return ret;
  }
  return '.';
}

async function loadFile() {
  const array = await readBinaryFile(state.currentOpenFile);
  const middle = array
    .map(
      (number, index) =>
        `<span data-offset="${index}">${number
          .toString(16)
          .padStart(2, '0')}</span>`
    )
    .join('');
  const left = [...Array(Math.ceil(array.length / 16)).keys()]
    .map(
      (number) => `<span>${(number * 16).toString(16).padStart(8, '0')}</span>`
    )
    .join('');
  const right = array
    .map(
      (number, index) =>
        `<span data-offset="${index}">${charCode(number)}</span>`
    )
    .join('');
  document.querySelector('#start-view').classList.add('hidden');
  document.querySelector(
    '#hex-view'
  ).innerHTML = `<div class="offset">${left}</div><div class="hex">${middle}</div><div class="text">${right}</div>`;
}
