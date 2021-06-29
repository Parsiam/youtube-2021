const video = document.querySelector("video");
const commentTotal = document.querySelector("#commentTotal");
const commentForm = document.querySelector("#commentForm");
const commentInput = document.querySelector("#commentInput");
const commentBtn = document.querySelector("#commentBtn");
const commentList = document.querySelector("#commentList");
const trashBtn = Array.from(document.querySelectorAll(".fa-trash"));

const deleteComment = async (event) => {
  try {
    const div = event.target.parentNode.parentNode.parentNode;
    const { id } = div.dataset;

    const response = await fetch(`/api/comment/${id}`, { method: "DELETE" });
    if (response.status === 204) {
      div.remove();
      commentTotal.textContent = Number(commentTotal.textContent) - 1;
    }
  } catch (error) {
    console.log(error);
  }
};

trashBtn.map((item) => item.addEventListener("click", deleteComment));

let loading = false;

const handleSubmit = async (event) => {
  event.preventDefault();

  if (commentInput.value.trim() === "") {
    return;
  }

  const { id } = video.dataset;

  const response = await fetch(`/api/video/${id}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: commentInput.value }),
  });

  if (response.status === 404) {
    return;
  }

  if (response.status === 201) {
    const commentId = await response.text();
    const { url, name } = commentList.dataset;
    const avatarURL = url.includes("http") ? url : "/" + url;
    const div = document.createElement("div");

    div.classList = "flex mb-5";
    div.dataset.id = commentId.replace(/\"/gi, "");

    div.innerHTML = `
      <div class="rounded-full" style="background-image:url(${avatarURL});background-size:cover;background-position:center; width:50px;height:50px"></div>
      <div class="flex justify-between w-full items-center">
        <div class="ml-5 flex flex-col">
          <span class="font-semibold">${name}</span>
          <span>${commentInput.value}</span>
        </div>
        <div>
          <i class="fas fa-trash icon-hover" aria-hidden="true"></i>
        </div>
      </div>
      `;
    const icon = div.querySelector("i");
    console.log(icon);
    icon.addEventListener("click", deleteComment);
    commentList.prepend(div);
    commentTotal.textContent = Number(commentTotal.textContent) + 1;
    commentInput.value = "";
  }
};

const handleInput = (event) => {
  if (event.target.value.trim() === "") {
    commentBtn.classList.remove("bg-blue-500", "text-white");
    commentBtn.classList.add(
      "pointer-events-none",
      "text-gray-600",
      "bg-gray-200"
    );
  } else {
    commentBtn.classList.remove(
      "pointer-events-none",
      "text-gray-600",
      "bg-gray-200"
    );
    commentBtn.classList.add("bg-blue-500", "text-white");
  }
};

if (commentForm) {
  commentForm.addEventListener("submit", handleSubmit);
  commentInput.addEventListener("input", handleInput);
}
