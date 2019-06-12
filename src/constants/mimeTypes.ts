interface IMimeTypes {
  [ext: string]: string;
}

const MIME_TYPES: IMimeTypes = {
  gif: "image/gif",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  mp4: "video/mp4"
};

export default MIME_TYPES;
