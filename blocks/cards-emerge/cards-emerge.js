/**
 * loads and decorates the cards-emerge block
 *
 * Expected authored structure (rows):
 *   Row 1  -> intro: eyebrow (first line) + heading (rest)
 *   Row 2+ -> item: cell 1 = acronym letter, cell 2 = title + description
 *
 * Only the visible design elements are rendered (eyebrow, heading, and the
 * letter/title/description rows). Decorative artwork from the source is omitted.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // --- Intro (first row): eyebrow + heading ---
  const introRow = rows.shift();
  const intro = document.createElement('div');
  intro.className = 'cards-emerge-intro';
  // Move the authored intro content (paragraphs/headings) into the intro wrapper.
  const introCell = introRow.querySelector(':scope > div') || introRow;
  [...introCell.children].forEach((el) => intro.append(el));

  // First paragraph acts as the eyebrow label.
  const eyebrow = intro.querySelector('p');
  if (eyebrow) eyebrow.classList.add('cards-emerge-eyebrow');

  // --- Items (remaining rows) ---
  const ul = document.createElement('ul');
  ul.className = 'cards-emerge-list';

  rows.forEach((row) => {
    const cells = [...row.children];
    const li = document.createElement('li');
    li.className = 'cards-emerge-item';

    const letterCell = document.createElement('div');
    letterCell.className = 'cards-emerge-letter';
    letterCell.setAttribute('aria-hidden', 'true');
    if (cells[0]) letterCell.textContent = cells[0].textContent.trim();

    const body = document.createElement('div');
    body.className = 'cards-emerge-body';
    if (cells[1]) {
      while (cells[1].firstElementChild) body.append(cells[1].firstElementChild);
      // Fallback: if the cell had bare text nodes, keep them.
      if (!body.childElementCount && cells[1].textContent.trim()) {
        body.textContent = cells[1].textContent.trim();
      }
    }

    li.append(letterCell, body);
    ul.append(li);
  });

  block.textContent = '';
  block.append(intro, ul);
}
