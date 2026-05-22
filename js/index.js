const posts = window.generatedPosts || [];

const projects = [
  {
    name: "WeatherFlow",
    description: "A minimal terminal-based weather dashboard built with Rust.",
    tech: ["Rust", "CLI", "OpenWeather API"],
    url: "#",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  // Set current year
  document.getElementById("current-year").textContent =
    new Date().getFullYear();

  // --- Mock Data ---

  const blogContainer = document.getElementById("blog-posts");
  const projectContainer = document.getElementById("project-list");

  addPosts(blogContainer);
  addProjects(projectContainer);
});

function addPosts(blogContainer) {
  posts.forEach((post) => {
    const article = document.createElement("article");

    // Create content container
    const contentDiv = document.createElement("div");
    contentDiv.className = "post-content";

    // Create heading and link
    const h3 = document.createElement("h3");
    const link = document.createElement("a");
    link.href = post.url;
    link.textContent = post.title;
    h3.appendChild(link);

    // Create excerpt
    const excerpt = document.createElement("p");
    excerpt.className = "post-excerpt";
    excerpt.textContent = post.description;

    // Assemble the components
    contentDiv.append(h3, excerpt);
    article.append(contentDiv);
    blogContainer.appendChild(article);
  });
}

function addProjects(projectContainer) {
  projects.forEach((project) => {
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
    techDiv.textContent = project.tech
      .map((t) => `[${t.toLowerCase()}]`)
      .join(" ");

    // Assemble and append to fragment
    div.append(h3, desc, techDiv);
    projectContainer.appendChild(div);
  });
}
