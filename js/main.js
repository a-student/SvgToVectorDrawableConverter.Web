function changeLib(sender) {
    $("#lib").text($(sender).text());
}

changeLib($("#lib-default")[0]);
