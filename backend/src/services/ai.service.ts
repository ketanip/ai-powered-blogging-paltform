import z from "zod";
import { llm } from "../common/llm";

export const summarizeBlog = async (blog: string) => {

    try {

        const summary = await llm.invoke(`
Summarize the following blog. Keep summary information dense and high quality. Only return summary in text format. No markdown. Max length 250 words.

BLOG:
${blog}
`);

        const keywords = await llm.invoke(`
            Extract 6 keywords from the following. Return then in a string each separated by a comma.
            
            BLOG:
            ${summary}
`);

        return {
            summary: summary.content.toString(), keywords: keywords.content.toString().split(","),
        }


    } catch (error) {
        console.error(error);
        throw new Error("Failed to summarize blog.")
    }

};