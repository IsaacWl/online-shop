const imagePickerElement = document.querySelector(
  '#image-upload-control input'
);
const imageDisplayElement = document.querySelector('#image-upload-control img');

function updateImageDisplay() {
  const files = imagePickerElement.files;

  if (!files || files.length === 0) {
    imageDisplayElement.style.display = 'none';
    return;
  }

  const pickedFile = files[0];

  imageDisplayElement.src = URL.createObjectURL(pickedFile);
  imageDisplayElement.style.display = 'block';
}

imagePickerElement.addEventListener('change', updateImageDisplay);
