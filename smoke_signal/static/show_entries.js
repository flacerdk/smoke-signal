$(document).ready(function () {
    $('button#refresh').bind('click', function(event) {
        var feedId = $('#entries').attr('feed_id');
        if (typeof feedId == "undefined")
            feedId = -1;
        $.getJSON($SCRIPT_ROOT + '/_refresh_entries', {
            feedId: feedId
        }, function(data) {
            data.map(function(entry) {
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
            })
        });
    });
});
