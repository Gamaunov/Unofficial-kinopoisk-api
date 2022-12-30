function pageLoaded() {
  const API_KEY = "03c5c780-f1e8-410b-b41f-69a9be085e87";
  const API_URL_POPULAR = `https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=${randomPage(
    1,
    10
  )}`;
  const API_URL_SEARCH =
    "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
  const API_DETAILS = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";
  const form = document.querySelector("form");
  const search = document.querySelector(".header__search");

  function randomPage(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  getMovies(API_URL_POPULAR);

  async function getMovies(url) {
    const resp = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
      },
    });
    const respData = await resp.json();
    showMovies(respData);
  }

  function showMovies(data) {
    const moviesEl = document.querySelector(".movies");

    document.querySelector(".movies").innerHTML = "";

    data.films.forEach((movie) => {
      const movieEl = document.createElement("div");
      movieEl.classList.add("movie");
      movieEl.innerHTML = `
            <img
              class="movie__card-img"
              src="${movie.posterUrlPreview}"
              alt="${movie.nameRu}"
            />
          `;
      movieEl.addEventListener("click", () => openModal(movie.filmId));
      moviesEl.appendChild(movieEl);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
    if (search.value) {
      getMovies(apiSearchUrl);

      search.value = "";
    }
  });

  //modal
  const modalEl = document.querySelector(".modal");

  async function openModal(id) {
    const resp = await fetch(API_DETAILS + id, {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
      },
    });
    const respData = await resp.json();
    document.body.classList.add("stop-scrolling");
    modalEl.classList.add("modal--show");
    modalEl.innerHTML = `
    <div class="modal__card">
      <img class="modal__img" src="${respData.posterUrl}" alt="Poster">
      <h2>
        <span class="modal__title">${respData.nameRu}</span>
        <span class="modal__year"> - ${respData.year} г.</span>
      </h2>
      <ul class="modal__info">
        <span class="loader"></span>
        <li class="modal__genre">Жанр: ${respData.genres.map(
          (el) => `<span>${el.genre}</span>`
        )}</li>
          ${
            respData.filmLength
              ? `<li class="modal__runtime">Время - ${respData.filmLength} минут</li>`
              : ""
          }
          <li class="modal__overview">${respData.description}</li>
          <li class="modal__site-inner"><a target="_blanc" class="modal__site" href="${
            respData.webUrl
          }">Перейти на сайт<svg class="modal__link-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-balloon-fill" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8.48 10.901C11.211 10.227 13 7.837 13 5A5 5 0 0 0 3 5c0 2.837 1.789 5.227 4.52 5.901l-.244.487a.25.25 0 1 0 .448.224l.04-.08c.009.17.024.315.051.45.068.344.208.622.448 1.102l.013.028c.212.422.182.85.05 1.246-.135.402-.366.751-.534 1.003a.25.25 0 0 0 .416.278l.004-.007c.166-.248.431-.646.588-1.115.16-.479.212-1.051-.076-1.629-.258-.515-.365-.732-.419-1.004a2.376 2.376 0 0 1-.037-.289l.008.017a.25.25 0 1 0 .448-.224l-.244-.487ZM4.352 3.356a4.004 4.004 0 0 1 3.15-2.325C7.774.997 8 1.224 8 1.5c0 .276-.226.496-.498.542-.95.162-1.749.78-2.173 1.617a.595.595 0 0 1-.52.341c-.346 0-.599-.329-.457-.644Z"/>
          </svg></a></li>
      </ul>
      <button class="modal__btn" type="button">Выйти</button>
    </div>
    `;
    const btnClose = document.querySelector(".modal__btn");
    btnClose.addEventListener("click", () => closeModal());
  }

  function closeModal() {
    modalEl.classList.remove("modal--show");
    document.body.classList.remove("stop-scrolling");
  }

  window.addEventListener("click", (e) => {
    if (e.target === modalEl) {
      closeModal();
    }
  });
  window.addEventListener("keydown", (e) => {
    if (e.keyCode === 27) {
      closeModal();
    }
  });
}

document.addEventListener("DOMContentLoaded", pageLoaded);
