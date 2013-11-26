function showListItemDialog() {
	showOverlayDialog();
	drawListItemForm();
};

function drawListItemForm() {
	var list_item_form = document.createElement("form");
	list_item_form.setAttribute("method", "post");
	list_item_form.setAttribute("id", "list-item-form");

	var list_item_name = document.createElement("input");
	list_item_name.setAttribute("type", "text");
	list_item_name.setAttribute("name", "item_name");
	list_item_name.setAttribute("placeholder", "Item name");

	var list_item_description = document.createElement("textarea");
	list_item_description.setAttribute("name", "list-item-description");
	list_item_description.setAttribute("form", "list-item-form");
	list_item_description.setAttribute("placeholder", "Description");

	var list_item_upload_button = document.createElement("input");
	list_item_upload_button.setAttribute("type", "file");
	list_item_upload_button.setAttribute("id", "list-item-upload-button");

	var list_item_submit_button = document.createElement("input");
	list_item_submit_button.setAttribute("type", "submit");
	list_item_submit_button.setAttribute("name", "image");

	list_item_form.appendChild(list_item_name);
	list_item_form.appendChild(document.createElement("br"));
	list_item_form.appendChild(list_item_description);
	list_item_form.appendChild(document.createElement("br"));
	list_item_form.appendChild(list_item_upload_button);
	list_item_form.appendChild(document.createElement("br"));
	list_item_form.appendChild(list_item_submit_button);

	appendOverlayContentView(list_item_form);

	document.getElementById("list-item-form").addEventListener('submit', function(event) {
		event.preventDefault();
		var fileInput = document.getElementById('list-item-upload-button');
		var file = fileInput.files[0];
		
		var formData = new FormData(document.getElementById("list-item-form"));
		// formData.append()
		var file_submission = new XMLHttpRequest();
		file_submission.open('POST', '../api/api.php?action="upload"', true);
		file_submission.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		file_submission.send(file);

		file_submission.onreadystatechange = function() {
			if (file_submission.readyState == 4) {
				if (file_submission.status != 200) {
					handleError(file_submission.responseText);
					return;
				} else {
					console.log(file_submission.responseText);
				};
			};
		};


	}, false);

};	