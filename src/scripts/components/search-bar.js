class SearchBar extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
    <input class="input-city form-control w-50 me-2" type="search" placeholder="Weather in your city"
    aria-label="Search">
    <button class="search-btn btn btn-outline-light" type="submit">Search</button>
    `;
  }
}

customElements.define("search-bar", SearchBar);
