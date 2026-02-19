// Selecting Elements (Document Object Model Manipulation)
const addBox = document.querySelector(".add-box"),
    popupBox = document.querySelector(".popup-box"),
    popupTitle = popupBox.querySelector("header p"),
    closeIcon = popupBox.querySelector("header i"),
    titleTag = popupBox.querySelector("input"),
    descTag = popupBox.querySelector("textarea"),
    addBtn = popupBox.querySelector("button");

// Convert month numbers into readable month names.
const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];

// Gets saved notes (as a string) and JSON.parse() Converts string back into JavaScript array     
const notes = JSON.parse(localStorage.getItem("notes") || "[]");

// These control whether: we are adding a new note or updating an existing one
let isUpdate = false, updateId;

// listens for clicks on the add box
// Show popup, Changes popup title, Changes button text, Preventing background scrolling
addBox.addEventListener("click", () => {
    popupTitle.innerText = "Add a new Note";
    addBtn.innerText = "Add Note";
    popupBox.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";
    if (window.innerWidth > 660) titleTag.focus();

});

// Close popup
closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
});

// Show existing notes from localStorage
function showNotes() {
    if (!notes) return;
    // This prevents duplicates when re-rendering.
    document.querySelectorAll(".note").forEach(li => li.remove());
    // Loop through notes array
    notes.forEach((note, id) => {
        // Convert <\n> back to <br/>
        let filterDesc = note.description.replaceAll("\n", '<br/>');
        
        // This builds note card using template literals.
        let liTag = `<li class="note">
                        <div class = "details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>

                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        addBox.insertAdjacentHTML("afterend", liTag);
    });
}
showNotes();

// Show menu on click of three dots
function showMenu(elem) {
    elem.parentElement.classList.add("show");
    
    // Shows the dropdown.
    document.addEventListener("click", e => {
        // If user clicks outside, then hide menu
        if (e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

// Delete a note
function deleteNote(noteId) {
    let confirmDel = confirm("Are you sure you want to delete this note?");
    if (!confirmDel) return;
    
    // Remove from array
    notes.splice(noteId, 1);
    
    // Update localStorage
    localStorage.setItem("notes", JSON.stringify(notes));
    
    // Re-render notes
    showNotes();
}

// Update a note
function updateNote(noteId, title, filterDesc) {
    // Convert <br/> back to newlines
    let description = filterDesc.replaceAll('<br/>', '\r\n');
    
    // Store ID
    updateId = noteId;
    isUpdate = true;

    // open pop up
    addBox.click();

    // Fill new inputs
    titleTag.value = title;
    descTag.value = description;

    // Change UI text
    popupTitle.innerText = "Update a Note";
    addBtn.innerText = "Update Note";
}

// Add a new note or update an existing note
addBtn.addEventListener("click", e => {
    // Prevent form reload
    e.preventDefault();

    // .trim() removes extra spaces.
    let title = titleTag.value.trim(),
        description = descTag.value.trim();

    if (title || description) {
        let currentDate = new Date(),
            month = months[currentDate.getMonth()],
            day = currentDate.getDate(),
            year = currentDate.getFullYear();

        //Create Note Object
        let noteInfo = { title, description, date: `${month} ${day}, ${year}` }
        
        // Add or Update
        if (!isUpdate) {
            notes.push(noteInfo);
        } else {
            isUpdate = false;
            notes[updateId] = noteInfo;
        }
      
        localStorage.setItem("notes", JSON.stringify(notes)); // save to localstorage
        showNotes(); // re-render notes
        closeIcon.click(); // close pop up
    }
});




