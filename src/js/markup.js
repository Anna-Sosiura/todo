import { deleteBtn, ul, updateBtn } from './refs';

export function renderTodo(obj) {
  const button = obj.status === 'todo' ? updateBtn : deleteBtn;

  return `
    <li class="todo" id="${obj.id}">
      <p>${obj.text}</p>
      ${button}
    </li>
  `;
}

export function renderOnReloadPage(array) {
  const markup = array
    .map((item) => renderTodo(item))
    .reverse()
    .join('');

  ul.innerHTML = markup;
}
