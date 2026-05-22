// @ts-check

/**
 * @typedef {Object} PostMetadata
 * @property {string} title
 * @property {string} date
 * @property {string} description
 * @property {string} url
 */

/**
 * @typedef {Object} ProjectMetadata
 * @property {string} name
 * @property {string} description
 * @property {string[]=} tags
 * @property {string[]=} tech
 * @property {string} url
 */

/** @type {PostMetadata[]} */
const posts = window.generatedPosts || [];

/** @type {ProjectMetadata[]} */
const projects = window.projectMetadata || [];

const HOMEPAGE_POST_LIMIT = 3;
const TYPEWRITER_CHARACTER_DELAY_MS = 55;
const TYPEWRITER_INITIAL_DELAY_MS = 120;
const TYPEWRITER_HOLD_DELAY_MS = 1400;
const TYPEWRITER_CLEAR_DELAY_MS = 180;

document.addEventListener("DOMContentLoaded", () => {
  /** @type {HTMLElement | null} */
  const blogContainer = document.getElementById("blog-posts");
  /** @type {HTMLElement | null} */
  const projectContainer = document.getElementById("project-list");
  /** @type {HTMLElement | null} */
  const currentYear = document.getElementById("current-year");
  /** @type {HTMLButtonElement | null} */
  const copyButton = document.querySelector(".social-copy-link");
  /** @type {HTMLElement | null} */
  const terminalTitle = document.querySelector(".terminal-title");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear().toString();
  }

  if (blogContainer) {
    addPosts(blogContainer);
  }

  if (projectContainer) {
    addProjects(projectContainer);
  }

  if (copyButton) {
    enableCopyToClipboard(copyButton);
  }

  if (terminalTitle) {
    startTypewriter(terminalTitle);
  }
});

/**
 * @param {HTMLElement} blogContainer
 * @returns {void}
 */
function addPosts(blogContainer) {
  posts.slice(0, HOMEPAGE_POST_LIMIT).forEach((post) => {
    const article = document.createElement("article");

    const time = document.createElement("time");
    time.className = "post-date";
    time.dateTime = post.date;
    time.textContent = post.date;

    const contentDiv = document.createElement("div");
    contentDiv.className = "post-content";

    const h3 = document.createElement("h3");
    const link = document.createElement("a");
    link.href = post.url;
    link.textContent = post.title;
    h3.appendChild(link);

    const excerpt = document.createElement("p");
    excerpt.className = "post-excerpt";
    excerpt.textContent = post.description;

    contentDiv.append(h3, excerpt);
    article.append(time, contentDiv);
    blogContainer.appendChild(article);
  });
}

/**
 * @param {HTMLElement} projectContainer
 * @returns {void}
 */
function addProjects(projectContainer) {
  projects.forEach((project) => {
    const projectTags = project.tags || project.tech || [];
    const div = document.createElement("div");
    div.className = "project-item";

    // Create heading and link
    const h3 = document.createElement("h3");
    h3.className = "project-name";

    const link = document.createElement("a");
    link.href = project.url;
    link.target = "_blank";
    link.textContent = `${project.name} ↗`;
    h3.appendChild(link);

    // Create description
    const desc = document.createElement("p");
    desc.className = "project-description";
    desc.textContent = project.description;

    // Create tech stack tags
    const techDiv = document.createElement("div");
    techDiv.className = "project-tech";
    techDiv.textContent = projectTags
      .map((t) => `[${t.toLowerCase()}]`)
      .join(" ");

    // Assemble and append to fragment
    div.append(h3, desc, techDiv);
    projectContainer.appendChild(div);
  });
}

/**
 * @param {HTMLButtonElement} copyButton
 * @returns {void}
 */
function enableCopyToClipboard(copyButton) {
  let feedbackTimeoutId = -1;
  const copyText = copyButton.dataset.copyText;

  copyButton.addEventListener("click", async () => {
    if (!copyText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(copyText);
      copyButton.classList.remove("is-copied");
      void copyButton.offsetWidth;
      copyButton.classList.add("is-copied");

      window.clearTimeout(feedbackTimeoutId);
      feedbackTimeoutId = window.setTimeout(() => {
        copyButton.classList.remove("is-copied");
      }, 1000);
    } catch (error) {
      console.error("Failed to copy text to clipboard.", error);
    }
  });
}

/**
 * @param {HTMLElement} titleElement
 * @returns {void}
 */
function startTypewriter(titleElement) {
  const ghostText = titleElement.querySelector(".terminal-title-ghost");
  const liveText = titleElement.querySelector(".terminal-title-live");
  const textElement = titleElement.querySelector(".terminal-title-text");

  if (!ghostText || !liveText || !textElement) {
    return;
  }

  const variants = (titleElement.dataset.titleVariants || "")
    .split("|")
    .map((variant) => variant.trim())
    .filter(Boolean);

  if (variants.length === 0) {
    return;
  }

  const longestVariant = variants.reduce((longest, current) =>
    current.length > longest.length ? current : longest,
  );
  let variantIndex = 0;

  ghostText.textContent = longestVariant;

  const typeVariant = () => {
    const activeVariant = variants[variantIndex];
    liveText.setAttribute("aria-label", activeVariant);
    textElement.textContent = "";

    let currentIndex = 0;

    const typeNextCharacter = () => {
      currentIndex += 1;
      textElement.textContent = activeVariant.slice(0, currentIndex);

      if (currentIndex < activeVariant.length) {
        window.setTimeout(typeNextCharacter, TYPEWRITER_CHARACTER_DELAY_MS);
        return;
      }

      window.setTimeout(() => {
        textElement.textContent = "";
        variantIndex = (variantIndex + 1) % variants.length;
        window.setTimeout(typeVariant, TYPEWRITER_CLEAR_DELAY_MS);
      }, TYPEWRITER_HOLD_DELAY_MS);
    };

    if (activeVariant.length > 0) {
      window.setTimeout(typeNextCharacter, TYPEWRITER_CHARACTER_DELAY_MS);
    }
  };

  window.setTimeout(typeVariant, TYPEWRITER_INITIAL_DELAY_MS);
}
