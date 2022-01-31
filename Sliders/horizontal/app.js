const sliders = document.querySelectorAll('.slider');

for (const slider of sliders) {
  slider.addEventListener('click', () => {
    removeClass();
    slider.classList.add('active')
  })
}

function removeClass() {
  sliders.forEach(element => {
    element.classList.remove('active')
  });
}