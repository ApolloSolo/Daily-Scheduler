$(".hour-content").on("click", ".task", function(){
    let text = $(this).text().trim();
    
    let textInput = $("<textarea>").addClass("form-control").val(text);

    $(this).replaceWith(textInput);
    textInput.trigger("focus");
})

$(".container").on("blur", "textarea", function () {
    let text = $(this).val().trim();
    let textP = $("<p>").addClass("m-1").text(text);
    $(this).replaceWith(textP);
})