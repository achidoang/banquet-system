// Initialize Quill editor
var quill = new Quill("#editor-container", {
  theme: "snow",
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      ["image", "code-block"],
    ],
  },
});

// Handle image upload
quill.getModule("toolbar").addHandler("image", () => {
  selectLocalImage();
});

function selectLocalImage() {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();

  input.onchange = () => {
    const file = input.files[0];
    if (file) {
      uploadImage(file);
    }
  };
}

function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  // Replace this with your server upload URL
  axios
    .post("/upload", formData)
    .then((response) => {
      const imageUrl = response.data.url; // Get image URL from server
      insertToEditor(imageUrl);
    })
    .catch((error) => {
      console.error("Error uploading image:", error);
    });
}

function insertToEditor(url) {
  const range = quill.getSelection();
  quill.insertEmbed(range.index, "image", url);
}

// Handle form submit
document.getElementById("submit-button").addEventListener("click", () => {
  const content = quill.root.innerHTML; // Get editor content as HTML
  console.log("Editor content:", content);

  // Send content to your server, including uploaded image URLs
  axios
    .post("/submit", { content: content })
    .then((response) => {
      console.log("Form submitted successfully:", response.data);
    })
    .catch((error) => {
      console.error("Error submitting form:", error);
    });
});
