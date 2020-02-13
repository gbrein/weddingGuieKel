const btnadd = document.getElementById("btn-add");
let removeB = document.getElementsByClassName("btn-remove");
let form = document.getElementById("form-rsvp");

let input = `<div class="form-group form-g">
              <input type="text" class="form-control" placeholder="Nome Completo" name="name" required>
							<input type="text" class="form-control phone-ddd-mask" pattern="[\+()]*(?:\d[\s\-\.()xX]*){10,14}"
								title="11999994444" placeholder="(11)99994444" required name="phone">
							<input type="email" class="form-control" placeholder="E-mail" name="email" required>
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


