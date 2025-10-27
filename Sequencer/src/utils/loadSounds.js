// src/utils/loadSounds.js

function importAll(r) {
  return r.keys().map((key) => {
    const pathParts = key.replace("./", "").split("/"); // ["drums", "kick.wav"]
    const name = pathParts.pop(); // "kick.wav"
    const folder = pathParts.join("/"); // "drums"
    const path = r(key);

    console.log("Loaded sound:", { name, folder, path }); // <-- log

    return {
      name: name.replace(/\.(mp3|wav)$/, ""),
      folder,
      path,
    };
  });
}

// Recorrer todos los sonidos dentro de "sounds" y sus subcarpetas
export const sounds = importAll(
  require.context("../assets/sounds", true, /\.(mp3|wav)$/)
);
