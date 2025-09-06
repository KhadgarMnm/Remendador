const quotePattern = /#_(\d+)/g;

function getPotentialElements() {
  const comments = document.querySelectorAll(".comment-text");
  return Array.from(comments).filter(el => quotePattern.test(el.textContent));
}

function getSmallestN(text) {
  const numbers = [...text.matchAll(/#_(\d+)/g)].map(m => parseInt(m[1], 10));
  return numbers.length > 0 ? Math.min(...numbers) : null;
}

function getParent(element) {
  return element.closest(".comment");
}

function moveIntoThreader(parentElement, elementToMove) {
  if (!(parentElement instanceof Element) || !(elementToMove instanceof Element)) {
    throw new Error("Both arguments must be DOM elements");
  }

  let threaderChilds = parentElement.parentElement.querySelector(":scope > .threader-childs");
  if (!threaderChilds) {
    threaderChilds = document.createElement("div");
    threaderChilds.className = "threader-childs";
    parentElement.parentElement.appendChild(threaderChilds);
  }

  let threader = threaderChilds.querySelector(":scope > .threader");
  if (!threader) {
    threader = document.createElement("div");
    threader.className = "threader";
    const expandableMark = document.createElement("div");
    expandableMark.className = "expandable-mark";
    threader.appendChild(expandableMark);
    threaderChilds.appendChild(threader);
  }

  threader.appendChild(elementToMove);
}

function removePagesDivs() {
  document.querySelectorAll('div.pages').forEach(div => div.remove());
}

function removeDuplicateThreaderZero() {
  const seenIds = new Set();
  const threaders = document.querySelectorAll('div.threader');
  threaders.forEach(threader => {
    const innerDiv = threader.querySelector('div[id^="c-"]');
    if (!innerDiv) return;
    const id = innerDiv.id;
    if (seenIds.has(id)) {
      threader.remove();
    } else {
      seenIds.add(id);
    }
  });
}

function putCommentsInTheirPlace() {
  const potentialElements = getPotentialElements();
  for (const potentialElement of potentialElements) {
    const smallestId = getSmallestN(potentialElement.textContent);
    if (smallestId !== null) {
      const elementParent = getParent(potentialElement);
      if (elementParent) {
        const rightfulParent = document.getElementById(`c-${smallestId}`);
        if (rightfulParent) {
          moveIntoThreader(rightfulParent, elementParent);
        }
      }
    }
  }
}

function main() {
  //removePagesDivs();
  removeDuplicateThreaderZero();
  putCommentsInTheirPlace();
}

async function loadTopLevelComments() {
  const storyId = window.location.pathname.split('/')[2];
  let page = 2;
  let totalLoaded = 0;
  const seen = new Set();

  while (true) {
    const url = `https://www.meneame.net/story/${storyId}/${page}`;
    try {
      const response = await fetch(url);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const topLevelComments = doc.querySelectorAll('.threader.zero');
      if (topLevelComments.length === 0) break;

      const commentsContainer = document.querySelector('#comments-top');

      topLevelComments.forEach(threader => {
        const commentDiv = threader.querySelector(':scope > .comment');
        if (!commentDiv) return;

        // Skip duplicates
        if (seen.has(commentDiv.id)) return;
        seen.add(commentDiv.id);

        // Append a clone to avoid moving nodes from the temporary doc
        commentsContainer.appendChild(threader.cloneNode(true));
      });

      totalLoaded += topLevelComments.length;
      page++;
    } catch (err) {
      console.error('Error loading comments:', err);
      break;
    }
  }
}


  (async function () {
  try {
    await loadTopLevelComments();
    main();
  } catch (err) {
    console.error(err);
  }
})();
