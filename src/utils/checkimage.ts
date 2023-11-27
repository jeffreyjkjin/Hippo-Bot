import { EmbedBuilder } from "@discordjs/builders"

/*
     DESC: Checks if the provided image is valid.
      PRE: url is not an empty string.
    PARAM: url - Link to the image.
     POST: Throws an error if image is not valid.
*/
const checkImage = (url: string) => {
    try {
        new EmbedBuilder().setImage(url);
    }
    catch (e: any) {
        throw `${url} does not contain a valid image.`;
    }
}

export default checkImage;