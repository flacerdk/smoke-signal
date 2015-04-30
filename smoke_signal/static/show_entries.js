function showEntries(feedId) {
    $('#entries').empty();
    if (feedId == -1) {
        entryText = document.createElement('p');
        text = document.createTextNode("Nothing to show!");
        entryText.appendChild(text);
        $('#entries').append(entryText);
        return false;
    }

    $.getJSON($SCRIPT_ROOT + '/feeds/' + feedId, {
    }, function(data) {
        $('#entries').attr('feedId', feedId);
        data.map(function(entry) {
            entryTitle = document.createElement('p');
            entryTitle.appendChild(document.createTextNode(entry.title));
            $('#entries').append(entryTitle);
            entryText = document.createElement('p');
            entryText.appendChild(document.createTextNode(entry.text));
            $('#entries').append(entryText);
        });
    });
    return false;
}

$(document).ready(function () {
    $('li.feed').bind('click', function(event) {
        showEntries(event.target.id);
    });
    $('button#refresh').bind('click', function(event) {
        var feedId = $('#entries').attr('feedId');
        if (typeof feedId == "undefined")
            feedId = -1;
        $.getJSON($SCRIPT_ROOT + '/_refresh_entries/' + feedId, {
        });
        showEntries(feedId);
    });
});
