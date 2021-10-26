const maxSizeMbs = 10;

const input = document.querySelector("input");
const p = document.querySelector("p");

if (input) {
  // add event listener
  input.addEventListener("change", () => {
    if (input && input.files) {
      uploadFile(input.files[0]);
    }
  });
} else {
  throw new Error("Couldn't find input element");
}

const uploadFile = (file: File) => {
  // check file size
  if (file.size > maxSizeMbs * 1024 * 1024) {
    console.log(`File must be less than ${maxSizeMbs}MB.`);
    return;
  }

  // add file to FormData object
  const fd = new FormData();
  fd.append("file", file);

  // send `POST` request
  fetch("/upload-file", {
    method: "POST",
    body: fd,
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      if (p) {
        p.innerHTML = `File uploaded succesfuly. You can access it <a href="${json.data.fileUrl}">here</a>`;
      }
    })
    .catch((err) => alert(err));
};
