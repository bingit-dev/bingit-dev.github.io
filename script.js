$(document).ready(function() {
    const radio1 = new Audio();
    let playing1 = false;
    const playButton1 = $(".play-button");

    playButton1.on("click", function() {
        if (playing1) {
            pauseRadio();
        } else {
            playRadio();
        }
    });

    function playRadio() {
        console.log("Audio URL:", "https://azura.tomsystems.uk/listen/yesradio/radio.mp3"); // Debugging line
        radio1.src = "https://azura.tomsystems.uk/listen/yesradio/radio.mp3";
        radio1.volume = 0.5;
        radio1.play().then(() => {
            playing1 = true;
            playButton1.find("i").removeClass("fa-play").addClass("fa-pause");
        });
    }

    function pauseRadio() {
        radio1.pause();
        playing1 = false;
        playButton1.find("i").removeClass("fa-pause").addClass("fa-play");
    }

    function update() {
        // Show the loading icon while data is loading
        $("#loading-icon").show();

        $.getJSON("https://azura.tomsystems.uk/api/nowplaying/1", function(data) {
            if (data.now_playing && data.now_playing.song) {
                $("#song").text(data.now_playing.song.title);
                $("#artist").text(data.now_playing.song.artist);

                const apiUrl = `https://tools.elevatehosting.co.uk/api/v2/lookup/song?title=${encodeURIComponent(data.now_playing.song.title)}&artist=${encodeURIComponent(data.now_playing.song.artist)}`;

                $.getJSON(apiUrl, function(result) {
                    if (result.error === false && result.found === true && result.result.covers) {
                        const covers = result.result.covers;
                        document.getElementById("spotify").href = "https://open.spotify.com/track/" + result.result.spotify_id;
                        if (covers.big) {
                            $("#radio-art").attr("src", covers.big);
                        } else if (covers.medium) {
                            $("#radio-art").attr("src", covers.medium);
                        } else if (covers.small) {
                            $("#radio-art").attr("src", covers.small);
                        } else {
                            // Handle case where no cover image is available
                            $("#radio-art").attr("src", data.now_playing.art);
                        }
                    } else {
                        // Handle case where cover data is missing or error occurred
                        $("#radio-art").attr("src", data.now_playing.art);
                    }
                });

                if (data.live && data.live.is_live == true) {
                    $("#dj-avatar").attr("src", data.live.art);
                    $("#dj-avatar").addClass("rounded-avatar");
                    $("#dj-name").text(data.live.streamer_name);
                } else {
                    $("#dj-avatar").attr("src", "https://i.ibb.co/Q8SMSWd/YES.png");
                    $("#dj-avatar").addClass("rounded-avatar");
                    $("#dj-name").text("YES! Radio");
                }

                // Hide the loading icon after data is loaded
                $("#loading-icon").hide();
            } else {
                // Handle case where now_playing data is missing or error occurred
                // Hide the loading icon
                $("#loading-icon").hide();
            }
        }).fail(function() {
            // Handle AJAX request failure
            // Hide the loading icon
            $("#loading-icon").hide();
        });
    }

    update(); // Call the update function once immediately
    setInterval(update, 10000); // Call the update function every 10 seconds
});
