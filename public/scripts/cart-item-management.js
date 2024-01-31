const cartItemFormElements = document.querySelectorAll('.cart-item-management');
const cartTotalPriceElement = document.getElementById('cart-total-price');
const cartBadge = document.querySelectorAll('.nav-items .badge');

async function updateCartItem(ev) {
  ev.preventDefault();

  const form = ev.target;
  const productId = form.dataset.productid;
  const csrfToken = form.dataset.csrf;
  // quantity field
  const quantity = form.firstElementChild.value;
  let response;
  try {
    response = await fetch('/cart/items', {
      method: 'PATCH',
      body: JSON.stringify({
        productId,
        quantity,
        _csrf: csrfToken,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    alert('Something went wrong!');
    return;
  }

  if (!response.ok) {
    alert('Something went wrong!');
    return;
  }

  const responseData = await response.json();

  if (responseData.updatedCartData.updatedItemPrice === 0) {
    form.parentElement.parentElement.remove();
  } else {
    const cartItemTotalPriceElement =
      form.parentElement.querySelector('.cart-item-price');

    cartItemTotalPriceElement.textContent = `$${responseData.updatedCartData.newTotalPrice.toFixed(
      2
    )}`;
  }

  // updating values

  cartTotalPriceElement.textContent = `$${responseData.updatedCartData.newTotalPrice.toFixed(
    2
  )}`;

  cartBadge.forEach((el) => {
    el.textContent = responseData.updatedCartData.newTotalQuantity;
  });
}

cartItemFormElements.forEach((element) => {
  element.addEventListener('submit', updateCartItem);
});
