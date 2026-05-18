// TODO move posts and projects to config files
const posts = [
  {
    title: "Demystifying CSS Grid for Backend Engineers",
    date: "2024-05-15",
    excerpt:
      "A practical guide to understanding and using CSS Grid layout without pulling your hair out.",
  },
];

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

    // Create time element
    const time = document.createElement("time");
    time.className = "post-date";
    time.setAttribute("datetime", post.date);
    time.textContent = post.date;

    // Create content container
    const contentDiv = document.createElement("div");
    contentDiv.className = "post-content";

    // Create heading and link
    const h3 = document.createElement("h3");
    const link = document.createElement("a");
    link.href = "#";
    link.textContent = post.title;
    h3.appendChild(link);

    // Create excerpt
    const excerpt = document.createElement("p");
    excerpt.className = "post-excerpt";
    excerpt.textContent = post.excerpt;

    // Assemble the components
    contentDiv.append(h3, excerpt);
    article.append(time, contentDiv);
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
