export function handleToDoBlock(block) {
    const { rich_text, checked } = block.to_do;
    const text = rich_text.map((text) => text.plain_text).join('');
    const checkedClass = checked ? "line-through" : "";
  
    return `<div class="flex items-center my-2">
      <input type="checkbox" class="mr-2" ${checked ? "checked" : ""} disabled />
      <span class="${checkedClass}">${text}</span>
    </div>`;
  }