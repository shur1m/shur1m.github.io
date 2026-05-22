const posts = window.generatedPosts || [];
const projects = window.projectMetadata || [];
const HOMEPAGE_POST_LIMIT = 3;

document.addEventListener("DOMContentLoaded", () => {
  const blogContainer = document.getElementById("blog-posts");
  const projectContainer = document.getElementById("project-list");
  const currentYear = document.getElementById("current-year");
  const copyButton = document.querySelector(".social-copy-link");
  const terminalTitle = document.querySelector(".terminal-title");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
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

function enableCopyToClipboard(copyButton) {
  let feedbackTimeoutId;
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

function startTypewriter(titleElement) {
  const textElement = titleElement.querySelector(".terminal-title-text");
  const fullText = titleElement.dataset.typewriterText || "";

  if (!textElement || !fullText) {
    return;
  }

  let currentIndex = 0;
  textElement.textContent = "";

  const typeNextCharacter = () => {
    currentIndex += 1;
    textElement.textContent = fullText.slice(0, currentIndex);

    if (currentIndex < fullText.length) {
      window.setTimeout(typeNextCharacter, 65);
    }
  };

  window.setTimeout(typeNextCharacter, 200);
}
