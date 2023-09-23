import * as basicLightbox from 'basiclightbox';
import '../../node_modules/basiclightbox/dist/basicLightbox.min.css';

import { renderTodo, renderOnReloadPage } from './markup';
import { KEY_LS, input, ul, deleteBtn, updateBtn } from './refs';

const todoList = JSON.parse(localStorage.getItem(KEY_LS)) || [];
let instance = null;

renderOnReloadPage(todoList);

export function addTodo() {
  if (!input.value.trim()) {
    alert('is empty');
    return;
  }

  const todoItem = {
    id: Date.now(),
    text: input.value,
    status: 'todo',
  };

  todoList.push(todoItem);
  localStorage.setItem(KEY_LS, JSON.stringify(todoList));
  input.value = '';
  ul.insertAdjacentHTML('afterbegin', renderTodo(todoItem));
}

ul.addEventListener('click', updateTodo);

function updateTodo(event) {
  if (!event.target.classList.contains('btn-update')) {
    return;
  }

  instance = basicLightbox.create(
    `
    <div class="modal-container">
      <input type='text' class='input-modal'/>
      <button type='button' class='btn-update-modal' id='${
        event.target.closest('li').id
      }'>
        Update todo
      </button>
      <button type='button' class='btn-close-modal'>X</button>
    </div>
  `,
    {
      closable: false,
    }
  );

  instance.show();

  if (instance.visible()) {
    const input = document.querySelector('.input-modal');
    const updateModalBtn = document.querySelector('.btn-update-modal');
    const closeModalBtn = document.querySelector('.btn-close-modal');

    closeModalBtn.addEventListener('click', instance.close);

    updateModalBtn.addEventListener('click', (event) =>
      handleUpdate(event, input.value)
    );
  }
}

// function closeModal()
function handleUpdate(event, value) {
  if (!value.trim()) {
    alert('is empty');
    return;
  }

  const storageData = JSON.parse(localStorage.getItem(KEY_LS));
  const currentId = Number(event.target.id);

  const updatedTodo = storageData.map((item) =>
    item.id === currentId ? { ...item, text: value } : item
  );

  instance.close();

  localStorage.setItem(KEY_LS, JSON.stringify(updatedTodo));
  renderOnReloadPage(updatedTodo);
}

ul.addEventListener('click', toggleStatus);

function toggleStatus(event) {
  if (event.target.nodeName === 'LI') {
    if (event.target.classList.contains('todo')) {
      event.target.classList.replace('todo', 'complete');
      event.target.lastElementChild.remove();
      event.target.insertAdjacentHTML('beforeend', deleteBtn);
    } else {
      event.target.classList.replace('complete', 'todo');
      event.target.lastElementChild.remove();
      event.target.insertAdjacentHTML('beforeend', updateBtn);
    }
  }
}

ul.addEventListener('click', removeItem);

function removeItem(event) {
  if (event.target.classList.contains('btn-delete')) {
    const storageData = JSON.parse(localStorage.getItem(KEY_LS));
    const updatedTodo = storageData.filter(
      (item) => item.id !== Number(event.target.parentNode.id)
    );

    localStorage.setItem(KEY_LS, JSON.stringify(updatedTodo));
    event.target.parentNode.remove();
  }
}
