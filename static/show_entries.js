$(function () {
    $('li.feed').bind('click', function(event) {
        $.getJSON($SCRIPT_ROOT + '/_show_entries', {
            id: event.target.id
        }, function(data) {
            $('#entries').empty();
            data.map(function(entry) {
                entryText = document.createElement('p');
                entryText.appendChild(document.createTextNode(entry.text));
                $('#entries').append(entryText);
            });
        });
        return false;
    });
});
