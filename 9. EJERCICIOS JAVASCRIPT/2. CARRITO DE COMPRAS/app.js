const db = {
  methods: {
    // definiendo funciones dentro de metodos
    find: (id) => {
      return db.items.find((item) => item.id === id);
    },
    // removeer todos los elementos de la base de datos
    // clikc en comprar, reduce el stock
    remove: (items) => {
      items.forEach((item) => {
        const product = db.methods.find(item.id);
        product.qty = product.qty - item.qty;
      });
      console.log(db);
    },
  },
  items: [
    {
      id: 0,
      title: "Azucar",
      price: 250,
      qty: 5,
    },
    {
      id: 1,
      title: "Leche",
      price: 345,
      qty: 50,
    },
    {
      id: 2,
      title: "Arroz",
      price: 1300,
      qty: 80,
    },
  ],
};

const shoppingCart = {
  items: [],
  methods: {
    // añadir un elementos al carrito
    add: (id, qty) => {
      // obtener el objeto actual dentro del carrito de compras
      const cartItem = shoppingCart.methods.get(id);

      if (cartItem) {
        if (shoppingCart.methods.hasInventory(id, qty + cartItem.qty)) {
          cartItem.qty++;
        } else {
          alert("No hay inventario suficiente");
        }
      } else {
        // primer elemento que añado a carrito, cuando esta vacio
        shoppingCart.items.push({ id, qty });
      }
    },

    // eliminar elementos del carrito y cuanto eliminar
    remove: (id, qty) => {
      // obtener el objeto actual dentro del carrito de compras
      const cartItem = shoppingCart.methods.get(id);
      if (cartItem.qty - 1 > 0) {
        cartItem.qty--;
      } else {
        shoppingCart.items = shoppingCart.items.filter(
          (item) => item.id !== id
        );
      }
    },

    count: () => {
      return shoppingCart.items.reduce((acc, item) => acc + item.qty, 0);
    },
    // pedir un id y regresar el articulo

    get: (id) => {
      // obtener el index, cada elemento me devuelve el id que pido
      const index = shoppingCart.items.findIndex((item) => item.id === id);

      return index >= 0 ? shoppingCart.items[index] : null;
    },

    // suma de los elementos del carrito de compra
    getTotal: () => {
      // let total = 0;
      const total = shoppingCart.items.reduce((acc, item) => {
        const found = db.methods.find(item.id);
        return acc + found.price * item.qty;
      }, 0);
      return total;
    },

    hasInventory: (id, qty) => {
      // si descuento y es mayor a cero me regresa el inventario si es negativo es false
      return db.items.find((item) => item.id === id).qty - qty >= 0;
    },
    // compra todo lo que tengo en el carrito de compra, actualizar db
    purchase: () => {
      db.methods.remove(shoppingCart.items);
      shoppingCart.items = [];
    },
  },
};

// renderisar

renderStore();

function renderStore() {
  const html = db.items.map((item) => {
    return `
      <div class="item">
        <div class="title">${item.title}</div>
        <div class="price">${numberToCurrency(item.price)}</div>
        <div class="qty">${item.qty} units</div>
  
        <div class="actions">
          <button class="add" data-id="${item.id}">Agregar al carrito</button>
        </div>
      </div>
      `;
  });

  document.querySelector("#store-container").innerHTML = html.join("");

  // los listener
  document.querySelectorAll(".item .actions .add").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = parseInt(button.getAttribute("data-id"));
      const item = db.methods.find(id);

      if (item && item.qty - 1 > 0) {
        // añadir al carrito de compras
        shoppingCart.methods.add(id, 1);
        console.log(shoppingCart);
        rederShoppingCart();
      } else {
        console.log("Ya no hay inventario");
      }
    });
  });
}

function rederShoppingCart() {
  const html = shoppingCart.items.map((item) => {
    const dbItem = db.methods.find(item.id);
    return `
        <div class="item">
          <div class="title">${dbItem.title}</div>
          <div class="price">${numberToCurrency(dbItem.price)}</div>
          <div class="qty">${item.qty} units</div>
          <div class="subtotal">Subtotal: ${numberToCurrency(
            item.qty * dbItem.price
          )}
          </div>
          <div class="actions">
            <button class="addOne" data-id="${dbItem.id}">+</button>
            <button class="removeOne" data-id="${dbItem.id}">-</button>
          </div>
        </div>
        `;
  });

  const closeButton = `
    <div class="cart-header">
    
      <button class="bClose">Close</button>
    </div>
    `;
  const purchaseButton =
    shoppingCart.items.length > 0
      ? `
    <div class="cart-actions">
      <button id="bPurchase">Terminar</button>
    
    </div>
    `
      : "";

  const total = shoppingCart.methods.getTotal();
  const totalContainer = `
    <div class="total">Total: ${numberToCurrency(total)}</div>
    `;

  const shoppingCartContainer = document.querySelector(
    "#shopping-cart-container"
  );

  shoppingCartContainer.innerHTML =
    closeButton + html.join("") + totalContainer + purchaseButton;

  shoppingCartContainer.classList.remove("hide");
  shoppingCartContainer.classList.add("show");

  document.querySelectorAll(".addOne").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = parseInt(button.getAttribute("data-id"));
      shoppingCart.methods.add(id, 1);
      renderShoppingCart();
    });
  });
  document.querySelectorAll(".removeOne").forEach((button) => {
    button.addEventListener("click", (e) => {
      // obtener el id
      const id = parseInt(button.getAttribute("data-id"));
      shoppingCart.methods.remove(id, 1);
      renderShoppingCart();
    });
  });

  document.querySelector(".bClose").addEventListener("click", (e) => {
    shoppingCartContainer.classList.remove("show");
    shoppingCartContainer.classList.add("hide");
  });

  const bPurchase = document.querySelector("#bPurchase");
  // implementando los listener

  if (bPurchase) {
    bPurchase.addEventListener("click", (e) => {
      shoppingCart.methods.purchase();
      renderStore();
      rederShoppingCart();
    });
  }
}

function numberToCurrency(n) {
  // numero a moneda
  return new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 2,
    style: "currency",
    currency: "USD",
  }).format(n);
}
