const Music = require("../models/music");
const musics = require("../musics/musics.json");

module.exports = async function () {
  for (let i = 0; i < musics.length; i++) {
    const m = musics[i];
    const musicExist = await Music.findOne({
      musicUrl: m.musicUrl,
    });
    if (!musicExist) {
      const newMusic = new Music(m);
      await newMusic.save().catch((e) => console.log(e));
    }
  }
};
