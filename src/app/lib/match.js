import { pipeline } from "@xenova/transformers";
import { jobDescriptionExtractor, resumeExtractor } from "./extractor";

const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

async function embedText(text) {
    const embed = await extractor(text, { pooling: "mean", normalize: true});
    return {text: text, embed: embed.data};
}
async function embedObj(obj){
    console.log(obj)
    let output = {}
    for (const key in obj) {
        const informationItems = obj[key];
        console.log(informationItems)
        if(informationItems){
            const embedItem = await Promise.all(
                informationItems.map(element => embedText(element))
            );
            output[key] = embedItem;
        }
    }
    return output;

}
function cosineSimilarity(a, b) {
    if (a.length !== b.length) {
        throw new Error('Vectors must be the same length');
    }
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}
function findMatchingItem(resumeEmbedObj, jdEmbedObj) {
    const output = {};
    for(const key in resumeEmbedObj) {
        let similarityArray = [];
        let input = jdEmbedObj[key];
        if(!input || input.length === 0){
            similarityArray.push({ required : "No requirements given", similarityPercentage : 1.0, similarText: "" });
        }else{
            for(let i =0 ; i < input.length; i++) {
                let highestValue = { required: "", similarityPercentage: 0, similarText: ""}
                if(resumeEmbedObj[key].length > 0){
                    for(let j=0; j < resumeEmbedObj[key].length; j++){
                        const similarity = cosineSimilarity(input[i].embed , resumeEmbedObj[key][j].embed);
                        highestValue.required = input[i].text;
                        if(highestValue.similarityPercentage < similarity){
                            highestValue.similarityPercentage = similarity;
                            highestValue.similarText = resumeEmbedObj[key][j].text;
                        }
                    }
                    similarityArray.push(highestValue)
                }else{
                    similarityArray.push(1.0)
                }
            }
        }
        output[key] = similarityArray;
    }
    return output;
}
export default async function matcher(resumeText, jdText) {
    const resumeObj = await resumeExtractor(resumeText);
    console.log(resumeObj);
    const embedResumeObj = await embedObj(resumeObj);
    const jobObj = await jobDescriptionExtractor(jdText);
    const embedJobResumeObj = await embedObj(jobObj);
    const similarityObj = findMatchingItem(embedResumeObj, embedJobResumeObj);
    console.log(similarityObj)
    return similarityObj;
}