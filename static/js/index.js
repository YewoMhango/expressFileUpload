"use strict";
var maxSizeMbs = 10;
var input = document.querySelector("input");
var p = document.querySelector("p");
if (input) {
    // add event listener
    input.addEventListener("change", function () {
        if (input && input.files) {
            uploadFile(input.files[0]);
        }
    });
}
else {
    throw new Error("Couldn't find input element");
}
var uploadFile = function (file) {
    // check file size
    if (file.size > maxSizeMbs * 1024 * 1024) {
        console.log("File must be less than " + maxSizeMbs + "MB.");
        return;
    }
    // add file to FormData object
    var fd = new FormData();
    fd.append("file", file);
    // send `POST` request
    fetch("/upload-file", {
        method: "POST",
        body: fd,
    })
        .then(function (res) { return res.json(); })
        .then(function (json) {
        console.log(json);
        if (p) {
            p.innerHTML = "File uploaded succesfuly. You can access it <a href=\"" + json.data.fileUrl + "\">here</a>";
        }
    })
        .catch(function (err) { return alert(err); });
};
//# sourceMappingURL=index.js.map