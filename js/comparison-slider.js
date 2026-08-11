document.querySelectorAll('.image-comparison').forEach((comparison) => {
  const range = comparison.querySelector('.image-comparison__range');
  if (!range) return;

  const updatePosition = () => {
    comparison.style.setProperty('--comparison-position', `${range.value}%`);
  };

  range.addEventListener('input', updatePosition);
  updatePosition();
});
