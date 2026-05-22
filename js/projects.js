// @ts-check

/**
 * @typedef {Object} ProjectMetadata
 * @property {string} name
 * @property {string} description
 * @property {string[]=} tags
 * @property {string[]=} tech
 * @property {string} url
 */

/** @type {ProjectMetadata[]} */
const projects = window.projectMetadata || [];

document.addEventListener("DOMContentLoaded", () => {
  /** @type {HTMLElement | null} */
  const projectContainer = document.getElementById("project-list");
  /** @type {HTMLElement | null} */
  const currentYear = document.getElementById("current-year");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  if (projectContainer) {
    addProjects(projectContainer);
  }
});

/**
 * @param {HTMLElement} projectContainer
 * @returns {void}
 */
function addProjects(projectContainer) {
  projects.forEach((project) => {
    const projectTags = project.tags || project.tech || [];
    const div = document.createElement("div");
    div.className = "project-item";

    const h3 = document.createElement("h3");
    h3.className = "project-name";

    const link = document.createElement("a");
    link.href = project.url;
    link.textContent = `${project.name} ↗`;
    h3.appendChild(link);

    const desc = document.createElement("p");
    desc.className = "project-description";
    desc.textContent = project.description;

    const techDiv = document.createElement("div");
    techDiv.className = "project-tech";
    techDiv.textContent = projectTags
      .map((tag) => `[${tag.toLowerCase()}]`)
      .join(" ");

    div.append(h3, desc, techDiv);
    projectContainer.appendChild(div);
  });
}
