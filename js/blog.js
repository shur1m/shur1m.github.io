// @ts-check

/**
 * @typedef {Object} PostMetadata
 * @property {string} title
 * @property {string} date
 * @property {string} description
 * @property {string} url
 */

/** @type {PostMetadata[]} */
const posts = window.generatedPosts || [];

document.addEventListener("DOMContentLoaded", () => {
  /** @type {HTMLElement | null} */
  const blogContainer = document.getElementById("blog-posts");
  /** @type {HTMLElement | null} */
  const currentYear = document.getElementById("current-year");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  if (blogContainer) {
    addPosts(blogContainer);
  }
});

/**
 * @param {HTMLElement} blogContainer
 * @returns {void}
 */
function addPosts(blogContainer) {
  posts.forEach((post) => {
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
