window.onload = function() {
  btnLike.addEventListener("click", likesFunction);
  btnDelete.addEventListener("click", deleteImage);
};

const btnLike = document.querySelector("#btn-like");
const btnId = document.querySelector("#btn-like").dataset.id;
const likesCount = document.querySelector(".likes-count");
const urlLikes = `/images/${btnId}/like`;
const btnDelete = document.querySelector("#btn-delete");
const deleteID = btnDelete.dataset.id;
const urlDeleteImg = `/images/${deleteID}`;

let deleteImage = function(e) {
  let response = confirm("Seguro que quiere eliminar esta imagen?");
  if (response) {
    fetch(urlDeleteImg, { method: "DELETE" })
      .then(response => {
        return response.json();
      })
      .then(data => {
        btnDelete.classList.remove("btn-danger");
        btnDelete.classList.add("btn-success");
        btnDelete.textContent = "Imagen eliminada!.";
      })
      .catch(err => {
        console.log(err);
      });
  } else {
  }
  e.preventDefault();
};

let likesFunction = function(e) {
  fetch(urlLikes, {
    method: "POST"
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      likesCount.textContent = data.likes;
    });
  e.preventDefault();
};
