class SiteFooter extends HTMLElement {
  connectedCallback() {
    const year = new Date().getFullYear();
    this.innerHTML = `
      <footer>
        <div class="footer-container">
          <p class="footer-text">
            &copy; ${year} Anson Xu. Keeping it Simple.
          </p>
        </div>
      </footer>
    `;
  }
}

customElements.define("site-footer", SiteFooter);
