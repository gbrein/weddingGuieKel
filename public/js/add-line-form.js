const btnadd = document.getElementById("btn-add");
let removeB = document.getElementsByClassName("btn-remove");
let form = document.getElementById("form-rsvp");

let input = `<div class="form-group form-g">
              <input type="text" class="form-control" placeholder="Nome Completo" name="name">
              <input type="text" class="form-control" placeholder="Telefone com DDD" name="phone">
              <input type="email" class="form-control" placeholder="E-mail" name="email">
              <button class="btn btn-primary btn-remove">Remover</button>
            </div>`;

let readRemove = () => {
  for (i = 0; i <= removeB.length; i++) {
    let linRemove = removeB[i];
    if (removeB[i] != undefined) {
      removeB[i].onclick = event => {
        event.preventDefault();
        linRemove.parentElement.innerHTML = "";
      };
    }
  }
};

readRemove();

let forminput = document.getElementById("form-input");

btnadd.onclick = event => {
  event.preventDefault();
  forminput.innerHTML += input;
  removeB = document.getElementsByClassName("btn-remove");
  readRemove();
};


