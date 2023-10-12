const router = require("express").Router(),
    play = require('play-dl'),
    yts = require("ytsr"),
    ytdl = require("ytdl-core"),
    fetch = require('isomorphic-unfetch'),
    { getData } = require("spotify-url-info")(fetch),
    fs = require("fs")


router.get("/", (req, res) => {
    if (!req.query.url) return res.json({ error: "No URL provided" })
    const url = req.query.url
    play.validate(url).then(async type => {
        if (!["search", "yt_video", "yt_playlist", "sp_track"].includes(type)) return res.json({ error: "Invalid URL" })
        if (type == "search") {
            if (url.startsWith("http") && play.yt_validate(url) === 'video') type = "yt_video"
        }
        console.log("Type :", type)
        let videoURLs = []

        if (type == "sp_track") {
            await getData(url).then(async (data) => { 
                await yts(`${data.title} ${data.artists[0].name}`, { limit: 1 }).then(async res => {
                    await ytdl.getBasicInfo(res.items[0].url).then(infos => {

                        videoURLs.push(infos.videoDetails.video_url)
                    })
                })

            })
        }
        else if (type == "yt_video") {
            console.log("it's URL !")
            await ytdl.getBasicInfo(url).then(infos => {
                videoURLs.push(infos.videoDetails.video_url)
            })
        }
        else if (type == "yt_playlist") {
            await play.playlist_info(url).then(async playlist => {
                await playlist.all_videos().then(async videos => {
                    for await (const video of videos) {
                        videoURLs.push(video.url)
                    }
                })
            })
        }

        if (!fs.existsSync(process.env.OUTPUT_DIR)) {
            fs.mkdirSync(process.env.OUTPUT_DIR)
        }

        for await (const video of videoURLs) {
            let info = await ytdl.getInfo(video);
            const stream = fs.createWriteStream((process.env.OUTPUT_DIR.endsWith("/") ? process.env.OUTPUT_DIR : process.env.OUTPUT_DIR + "/") + info.videoDetails.title + ".webm")
            await ytdl(video, {
                filter: 'audioonly'
            }).pipe(stream)
        }
        res.json({ message: "ok" })
    }).catch(e => {
        console.error(e)
        res.json({ error: e })
    })
})

module.exports = {
    router
}