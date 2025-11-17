// ------------------------------------
//  INICIALIZAR EMAILJS
// ------------------------------------
emailjs.init("bEyf2tJ4yNiFw2N4k");


// ------------------------------------
//  VARIABLES
// ------------------------------------
let cart = [];


const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeModal = document.querySelector('.close');
const cartItems = document.getElementById('cartItems');
const totalPriceEl = document.getElementById('totalPrice');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');


// ------------------------------------
//  CARRITO
// ------------------------------------
function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCart();
}


function updateCart() {
  cartItems.innerHTML = '';
  let total = 0;


  cart.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
      <button class="remove-btn" onclick="removeFromCart('${item.name}')">Eliminar</button>
    `;
    cartItems.appendChild(li);
    total += item.price * item.quantity;
  });


  totalPriceEl.textContent = total.toFixed(2);
  cartCount.textContent = cart.reduce((acc, i) => acc + i.quantity, 0);
}


function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  updateCart();
}


// ------------------------------------
//  CHECKOUT + EMAILJS
// ------------------------------------
checkoutBtn.onclick = () => {
  if (cart.length === 0) {
    alert('No hay productos en el carrito.');
    return;
  }

  // OBTENER CAMPOS
const clientName = document.getElementById("clientName").value.trim();
const clientEmail = document.getElementById("clientEmail").value.trim();
const clientPhone = document.getElementById("clientPhone").value.trim();

// REGEX
const phoneRegex = /^[0-9 ]+$/;                // números + espacios
const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;   // solo letras y espacios

// VALIDAR TELÉFONO
if (!clientPhone) {
  alert("Debes ingresar tu teléfono.");
  return;
}
if (!phoneRegex.test(clientPhone)) {
  alert("El teléfono solo puede contener números y espacios.");
  return;
}

// VALIDAR NOMBRE
if (!clientName) {
  alert("Debes ingresar tu nombre.");
  return;
}
if (!nameRegex.test(clientName)) {
  alert("El nombre solo puede contener letras y espacios.");
  return;
}

// VALIDAR EMAIL
if (!clientEmail || !clientEmail.includes("@")) {
  alert("Debes ingresar un correo válido.");
  return;
}

  const orderId = Date.now();
  const total = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const data = {
  email: clientEmail,          // destinatario
  order_id: orderId,
  orders: cart.map(item => ({
    nombre: item.name,
    price: item.price,
    units: item.quantity
  })),
  cost: {
    shipping: 0,
    tax: 0,
    total: total
  },
  cliente_nombre: clientName,   // ahora coincide con el template
  cliente_email: clientEmail,   // coincide con el template
  cliente_telefono: clientPhone // coincide con el template
};

  emailjs.send("CamChaves27", "template_rqetchq", data)
    .then(() => {
      alert("¡Tu pedido fue enviado correctamente! Pronto te contactaremos");
      // Vaciar carrito visual
      document.getElementById("cartItems").innerHTML = "";
      document.getElementById("totalPrice").innerText = "0.00";
      document.getElementById("cartCount").innerText = "0";

      // Vaciar campos del formulario
      document.getElementById("clientPhone").value = "";
      document.getElementById("clientName").value = "";
      document.getElementById("clientEmail").value = "";

      cart = [];
      updateCart();
      cartModal.style.display = 'none';
    })
    .catch((error) => {
      console.error("EmailJS Error:", error);
      alert("Hubo un problema al enviar el pedido. Inténtalo nuevamente.");
    });
};

// Seleccionar formulario
const contactForm = document.getElementById("contactForm");

// Evento al enviar formulario
contactForm.addEventListener("submit", function(e) {
  e.preventDefault(); // Evita que se recargue la página

  // Obtener valores de los campos
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const time = new Date().toLocaleString(); // Fecha/hora para el template

  // Validaciones básicas
  if (!name) {
    alert("Por favor, ingresa tu nombre.");
    return;
  }
  if (!email || !email.includes("@")) {
    alert("Por favor, ingresa un correo válido.");
    return;
  }
  if (!message) {
    alert("Por favor, escribe tu mensaje.");
    return;
  }

  // Datos para EmailJS
  const templateParams = {
    name: name,
    email: email,
    message: message,
    time: time
  };

  // Enviar correo con EmailJS
  emailjs.send("CamChaves27", "template_ru5b7oe", templateParams)
    .then(() => {
      alert("¡Tu mensaje fue enviado correctamente! Te responderemos pronto.");

      // Limpiar campos
      document.getElementById("name").value = "";
      document.getElementById("email").value = "";
      document.getElementById("message").value = "";
    })
    .catch((error) => {
      console.error("EmailJS Error:", error);
      alert("Hubo un problema al enviar tu mensaje. Intenta nuevamente.");
    });
});

// ------------------------------------
//  MODAL DEL CARRITO
// ------------------------------------
function openCart() {
  cartModal.style.display = "flex";
  cartModal.classList.add("show");
}


function closeCart() {
  cartModal.classList.remove("show");
  setTimeout(() => {
    cartModal.style.display = "none";
  }, 300);
}


cartBtn.onclick = openCart;
closeModal.onclick = closeCart;


// Cerrar si se hace clic fuera del modal
window.onclick = (e) => {
  if (e.target === cartModal) closeCart();
};


// ------------------------------------
//  SECCIONES
// ------------------------------------
function mostrarSeccion(id) {
  const secciones = document.querySelectorAll("section");


  secciones.forEach(sec => {
    sec.classList.remove("active");
    sec.style.display = "none";
  });


  const seccion = document.getElementById(id);
  seccion.style.display = "block";


  setTimeout(() => seccion.classList.add("active"), 50);


  if (id === "productos") {
    cartBtn.style.display = "flex";
  } else {
    cartBtn.style.display = "none";
    closeCart();
  }
}


document.addEventListener("DOMContentLoaded", () => mostrarSeccion('home'));


// ------------------------------------
//  FORMULARIO
// ------------------------------------
document.getElementById('contactForm').addEventListener('submit', function () {
  alert('Tu mensaje ha sido preparado para enviar. ¡Gracias por contactarnos!');
});


