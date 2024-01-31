const deleteProductButtonElements = document.querySelectorAll(
  '.product-item button'
);

async function deleteProduct(ev) {
  const buttonElement = ev.target;
  const productId = buttonElement.dataset.productid;
  const csrfToken = buttonElement.dataset.csrf;

  const response = await fetch(
    `/admin/products/${productId}?_csrf=${csrfToken}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    alert('Something went wrong!');
    return;
  }

  // consider just select element by id
  buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
}

deleteProductButtonElements.forEach((button) => {
  button.addEventListener('click', deleteProduct);
});
