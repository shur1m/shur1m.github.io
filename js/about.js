// @ts-check

/** @typedef {import("./types").ResumeRoleMetadata} ResumeRoleMetadata */
/** @typedef {import("./types").SkillGroupMetadata} SkillGroupMetadata */

import {
  resumeRoleMetadata as roles,
  skillGroupMetadata as skillGroups,
} from "./resume-metadata.js";

document.addEventListener("DOMContentLoaded", () => {
  /** @type {HTMLElement | null} */
  const resumeContainer = document.getElementById("resume-list");
  /** @type {HTMLElement | null} */
  const skillsContainer = document.getElementById("skills-list");
  /** @type {HTMLElement | null} */
  const currentYear = document.getElementById("current-year");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear().toString();
  }

  if (resumeContainer) {
    addResumeRoles(resumeContainer);
  }

  if (skillsContainer) {
    addSkillGroups(skillsContainer);
  }
});

/**
 * @param {HTMLElement} resumeContainer
 * @returns {void}
 */
function addResumeRoles(resumeContainer) {
  if (roles.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "resume-empty";
    emptyState.textContent =
      "Add roles in js/resume-metadata.js to populate this page.";
    resumeContainer.appendChild(emptyState);
    return;
  }

  roles.forEach((role) => {
    const article = document.createElement("article");
    article.className = "resume-item";

    const time = document.createElement("p");
    time.className = "resume-period";
    time.textContent = role.period;

    const content = document.createElement("div");

    const heading = document.createElement("h3");
    heading.className = "resume-role";

    const roleName = document.createElement("span");
    roleName.textContent = role.role;

    const separator = document.createElement("span");
    separator.className = "resume-company";
    separator.textContent = "@";

    const company = document.createElement("span");
    company.className = "resume-company";
    company.textContent = role.company;

    const description = document.createElement("p");
    description.className = "resume-description";
    description.textContent = role.description;

    heading.append(roleName, separator, company);
    content.append(heading);
    content.append(description);
    article.append(time, content);
    resumeContainer.appendChild(article);
  });
}

/**
 * @param {HTMLElement} skillsContainer
 * @returns {void}
 */
function addSkillGroups(skillsContainer) {
  skillGroups.forEach((group) => {
    const article = document.createElement("article");
    article.className = "skill-group";

    const heading = document.createElement("h3");
    heading.className = "skill-group-title";
    heading.textContent = group.title;

    const items = document.createElement("p");
    items.className = "skill-group-items";
    items.textContent = group.items.join(", ");

    article.append(heading, items);
    skillsContainer.appendChild(article);
  });
}
