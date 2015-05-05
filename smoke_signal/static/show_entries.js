function addEntries(entries) {
    if (entries.error) {
        errorDiv = document.createElement('div');
        errorDiv.setAttribute('class', 'error');
        $('#entries').append(errorDiv);
        errorText = document.createElement('p');
        errorText.appendChild(document.createTextNode(entries.error));
        errorDiv.appendChild(errorText);
        return;
    }

    entries.map(function(entry) {
        entryDiv = document.createElement('div');
        entryDiv.setAttribute('class', 'entry');
        entryDiv.setAttribute('id', entry.entry_id);
        $('#entries').append(entryDiv);
        entryTitle = document.createElement('a');
        entryTitle.setAttribute('href', entry.url);
        entryTitle.appendChild(document.createTextNode(entry.title));
        entryDiv.appendChild(entryTitle);
        entryText = document.createElement('p');
        entryText.appendChild(document.createTextNode(entry.text));
        entryDiv.appendChild(entryText);
    });
}


$(document).ready(function () {
    $('button#refresh').bind('click', function(event) {
        var feedId = $('#entries').attr('feed_id');
        if (typeof feedId == "undefined")
            feedId = -1;
        $.getJSON($SCRIPT_ROOT + '/_refresh_entries', {
            feedId: feedId
        }, addEntries);
    });
});
