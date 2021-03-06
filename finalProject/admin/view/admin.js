window.addEventListener("load", async (event) => {
  event.preventDefault();
  try {
    let request = await fetch(
      "http://localhost/finalProject/admin/controller/Validate.php",
      {
        method: "GET",
      }
    );
    let answer = await request.json();
    console.log(answer);

    if (answer["error"] != undefined) {
      throw new Error(answer["error"]);
    }
  } catch (e) {
    window.location.replace(
      "http://localhost/finalProject/login/view/login.html"
    );
  }
});

const createEvent = document.getElementById("createButton");
createEvent.addEventListener("click", async (event) => {
  event.preventDefault();
 
  removeMessages();

  let input = validateInput("create");

  if (input != null) {
    const data = new FormData();
    data.append("table", input.table);
    data.append("name", input.name);
    data.append("description", input.description);
    data.append("vegetarian", input.vegetarian);
    data.append("price", input.price);
    data.append("action", "create");
    try {
    const request = await fetch(
      "http://localhost/finalProject/admin/controller/Admin.php",
      {
        method: "POST",
        body: data,
      }
    );
    let body = await request.json();
    console.log(body);
    if (body["error"] != undefined) {
      throw new Error(body["error"]);
    }

    showMessage("credo");

    } catch (e) {
    if (!document.body.contains(document.getElementById("errorRequest"))) {
      let errorAnswer = document.createElement("p");

      errorAnswer.setAttribute("id", "errorRequest");
      errorAnswer.setAttribute("class", "d-flex justify-content-center form");
      errorAnswer.innerHTML = e;
      errorAnswer.style.color = "white";
      document.body.append(errorAnswer);
    }
    }
  }
});

const readEvent = document.getElementById("readButton");
readEvent.addEventListener("click", async (event) => {
  event.preventDefault();

  removeMessages();

  let input = validateInput("read");

  if (input != null) {
    const data = new FormData();
    data.append("table", input.table);
    data.append("name", input.name);
    data.append("action", "read");
    try {
      const request = await fetch(
        "http://localhost/finalProject/admin/controller/Admin.php",
        {
          method: "POST",
          body: data,
        }
      );
      let body = await request.json();
      if (body["error"] != undefined) {
        throw new Error(body["error"]);
      }

      showDish(body);
    } catch (e) {
      if (!document.body.contains(document.getElementById("errorRequest"))) {
        let errorAnswer = document.createElement("p");

        errorAnswer.setAttribute("id", "errorRequest");
        errorAnswer.setAttribute("class", "d-flex justify-content-center form");
        errorAnswer.innerHTML = e;
        errorAnswer.style.color = "white";
        document.body.append(errorAnswer);
      }
    }
  }
});

const deleteEvent = document.getElementById("deleteButton");
deleteEvent.addEventListener("click", async (event) => {
  event.preventDefault();

  removeMessages();

  let input = validateInput("delete");

  if (input != null) {
    try {
      let data = new FormData();
      data.append("name", input.name);
      data.append("table", input.table);
      data.append("action", "remove");
      const request = await fetch(
        "http://localhost/finalProject/admin/controller/Admin.php",
        {
          method: "POST",
          body: data,
        }
      );

      let body = await request.json();

      if (body["error"] != undefined) {
        throw new Error(body["error"]);
      }

      showMessage("eliminado");
    } catch (e) {
      if (!document.body.contains(document.getElementById("errorRequest"))) {
        let errorAnswer = document.createElement("p");

        errorAnswer.setAttribute("id", "errorRequest");
        errorAnswer.setAttribute("class", "d-flex justify-content-center form");
        errorAnswer.innerHTML = e;
        errorAnswer.style.color = "white";
        document.body.append(errorAnswer);
      }
    }
  }
});

const validateInput = (action) => {
  let dish = document.getElementById("name").value;
  let table = document.getElementById("table").value;

  if (dish.length > 0 && table.length > 0 && action != "create") {
    return {
      name: dish,
      table,
    };
  } else if (dish.length > 0 && table.length > 0 && action == "create") {
    let price = document.getElementById("price").value;
    let description = document.getElementById("description").value;
    let vegetarian = document.getElementById("vegetarian").value;

    if (
      price > 0 &&
      description.length > 0 &&
      (vegetarian == "si" || vegetarian == "no")
    ) {
      return {
        name: dish,
        table,
        price,
        description,
        vegetarian,
      };
    } else {
      if (!document.body.contains(document.getElementById("emptyName"))) {
        let errorAnswer = document.createElement("p");

        errorAnswer.setAttribute("id", "emptyName");
        errorAnswer.setAttribute("class", "d-flex justify-content-center form");
        errorAnswer.innerHTML =
          "Debes ingresar correctamente todos los datos...";
        errorAnswer.style.color = "white";
        document.body.append(errorAnswer);
      }
      return null;
    }
  } else {
    if (!document.body.contains(document.getElementById("emptyName"))) {
      let errorAnswer = document.createElement("p");

      errorAnswer.setAttribute("id", "emptyName");
      errorAnswer.setAttribute("class", "d-flex justify-content-center form");
      errorAnswer.innerHTML =
        "Debes ingresar el nombre y el tipo de un plato...";
      errorAnswer.style.color = "white";
      document.body.append(errorAnswer);
    }
    return null;
  }
};

const showMessage = (method) => {
  let message = document.createElement("p");

  message.setAttribute("id", "message");
  message.setAttribute("class", "d-flex justify-content-center form");
  message.innerHTML = `El plato se ha ${method} con ??xito.`;
  message.style.color = "white";
  document.body.append(message);
};

const showDish = (data) => {
  let wrapper = document.getElementById("wrapper");

  let section = document.createElement("section");
  let name = document.createElement("p");
  let description = document.createElement("p");
  let price = document.createElement("p");
  let vegetarian = document.createElement("p");

  section.setAttribute("class", "container");
  section.setAttribute("id", "getMessage")
  wrapper.append(section);

  console.log(data)
  name.innerHTML = `Nombre: ${data[0]["name"]}`;
  description.innerHTML = `Descipci??n: ${data[0]["description"]}`;
  price.innerHTML = `Precio: $${data[0]["price"]}`;
  vegetarian.innerHTML = `Vegetariano: ${data[0]["vegetarian"]}`;

  name.style.color = "white"; 
  description.style.color = "white"; 
  price.style.color = "white"; 
  vegetarian.style.color = "white";

  name.setAttribute("class", "col");
  description.setAttribute("class", "col");
  price.setAttribute("class", "col");
  vegetarian.setAttribute("class", "col");

  section.appendChild(name);
  section.appendChild(description);
  section.appendChild(price);
  section.appendChild(vegetarian);
};

const removeMessages = () => {

  if (document.body.contains(document.getElementById("getMessage"))) {
    let wrapper = document.getElementById("wrapper");
    wrapper.removeChild(document.getElementById("getMessage"));
  }
  if (document.body.contains(document.getElementById("message"))) {
    document.body.removeChild(document.getElementById("message"));
  }
  
  if (document.body.contains(document.getElementById("errorRequest"))) {
    document.body.removeChild(document.getElementById("errorRequest"));
  }
  
  if (document.body.contains(document.getElementById("emptyName"))) {
    document.body.removeChild(document.getElementById("emptyName"));
  }
}