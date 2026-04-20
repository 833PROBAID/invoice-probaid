const codeEditorPlugin = (editor, opts = {}) => {
	// Add button to component toolbar
	editor.Panels.addButton("options", {
		id: "edit-code",
		className: "fa fa-code",
		command: "open-code-editor",
		attributes: { title: "Edit Code" },
	});

	// Add command to open code editor
	editor.Commands.add("open-code-editor", {
		run: function (editor, sender) {
			const selectedComponent = editor.getSelected();

			if (!selectedComponent) {
				alert("Please select a component first");
				return;
			}

			// Create modal for code editing
			const modal = editor.Modal;
			modal.setTitle("Edit Component Code");

			// Get component HTML
			const componentHTML = selectedComponent.toHTML();

			// Create textarea for code editing
			const codeContainer = document.createElement("div");
			const textarea = document.createElement("textarea");
			textarea.value = componentHTML;
			textarea.style.width = "100%";
			textarea.style.height = "300px";
			textarea.style.fontFamily = "monospace";
			textarea.style.fontSize = "14px";
			textarea.style.color = "#333";

			// Create save button
			const saveBtn = document.createElement("button");
			saveBtn.innerHTML = "Save Changes";
			saveBtn.style.margin = "10px 0";
			saveBtn.style.padding = "8px 16px";
			saveBtn.style.backgroundColor = "#3b5998";
			saveBtn.style.color = "white";
			saveBtn.style.border = "none";
			saveBtn.style.borderRadius = "4px";
			saveBtn.style.cursor = "pointer";

			saveBtn.onclick = () => {
				try {
					// Replace component with new HTML
					selectedComponent.replaceWith(textarea.value);
					modal.close();
				} catch (error) {
					console.error("Error updating component:", error);
					alert("Error updating component. Check your HTML syntax.");
				}
			};

			// Assemble modal content
			codeContainer.appendChild(textarea);
			codeContainer.appendChild(saveBtn);
			modal.setContent(codeContainer);
			modal.open();
		},
	});
};

export default codeEditorPlugin;
