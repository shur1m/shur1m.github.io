class SiteNav extends HTMLElement {
  connectedCallback() {
    const basePath = this.getAttribute("base-path") ?? ".";
    const brandHref = this.getAttribute("brand-href") ?? `${basePath}/index.html`;

    this.innerHTML = `
      <nav>
        <div class="nav-container">
          <a href="${brandHref}" class="nav-brand">Anson Xu</a>
          <div class="nav-links">
            <a href="${basePath}/about.html">about</a>
            <a href="${basePath}/blog.html">blog</a>
            <a href="${basePath}/projects.html">projects</a>
          </div>
        </div>
      </nav>
    `;
  }
}

customElements.define("site-nav", SiteNav);
