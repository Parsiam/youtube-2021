const form = document.querySelector("form");
const input = document.querySelector("input");

const handleSubmit = (event) => {
  event.preventDefault();
  const word = input.value;
  if (word.trim() === "") {
    return;
  } else {
    form.submit();
  }
};

form.addEventListener("submit", handleSubmit);
