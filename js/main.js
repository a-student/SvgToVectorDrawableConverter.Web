$("#output-warning").hide();
$("#output-error").hide();
$("#result").hide();

Dropzone.options.dropZone = {
    acceptedFiles: ".svg",
    init: function () {

        this.on("addedfile", function (file) {
            $("#output-warning").hide();
            $("#output-error").hide();
            $("#result").hide();
            $("#lib-dropdown").addClass("disabled");

            while (this.files[1]) {
                this.removeFile(this.files[0]);
            }
        });

        this.on("success", function (file, response) {
            var output = response.output.trim();
            if (output.length > 0) {
                output = output.replace("[", "<strong>").replace("]", "!</strong>");
                if (output.match(/\Werror\W/i)) {
                    $("#output-error").html(output);
                    $("#output-error").show();
                } else {
                    $("#output-warning").html(output);
                    $("#output-warning").show();
                }
            }

            if (response.result.length > 0) {
                $("#result-name").text(response.result[0].name);
                $("#result-data").text(response.result[0].data);
                $("#result").show();

                $("#result-data").removeClass("prettyprinted");
                PR.prettyPrint();
            }
        });

        this.on("error", function (file, errorMessage, xhr) {
            $("#output-error").html(errorMessage);
            $("#output-error").show();
        });

        this.on("queuecomplete", function () {
            $("#lib-dropdown").removeClass("disabled");
        });

    }
};

function changeLib(sender) {
    var text = $(sender).text();
    var lib = $("#lib");
    if (lib.text() !== text) {
        lib.text(text);
        $("[name='lib']").val(sender.id == "lib-default" ? "" : text);

        var dropZone = Dropzone.forElement("#drop-zone");
        var file = dropZone.files[0];
        if (file) {
            dropZone.removeAllFiles(true);
            dropZone.addFile(file);
        }
    }
}

changeLib($("#lib-default")[0]);

function saveToFile() {
    var blob = new Blob([$("#result-data").text()], { type: "text/xml;charset=utf-8" });
    saveAs(blob, $("#result-name").text(), true);
}

function selectCode() {
    var text = $("#result-data")[0];
    if (document.body.createTextRange) {
        var range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
