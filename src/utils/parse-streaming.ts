import { fetchStream } from "@/utils/fetch-stream";

export const parseStreaming = async (
    controller: AbortController,
    query: string,
    search_uuid: string,
    onMarkdown: (value: string) => void,
    onError?: (status: number) => void,
) => {
    const decoder = new TextDecoder();
    let uint8Array = new Uint8Array();
    let chunks = "";
    let answer = "";

    const dataToSend = {
        "input": query,
        "config": {
            "configurable": {
                "llm": "vllm",
                "llm_temperature": 0.3
            }
        },
        "kwargs": {}
    }

    const response = await fetch(`/llm/rag_with_source/stream`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "*./*",
        },
        signal: controller.signal,
        body: JSON.stringify(dataToSend),
    });

    if (response.status !== 200) {
        onError?.(response.status);
        return;
    }

    const markdownParse = (text: string) => {
        onMarkdown(
            text
                .replace(/\[\[([cC])itation/g, "[citation")
                .replace(/[cC]itation:(\d+)]]/g, "citation:$1]")
                .replace(/\[\[([cC]itation:\d+)]](?!])/g, `[$1]`)
                .replace(/\[[cC]itation:(\d+)]/g, "[citation]($1)"),
        );
    };

    fetchStream(
        response,
        (chunk) => {
            uint8Array = new Uint8Array([...uint8Array, ...chunk]);
            chunks = decoder.decode(uint8Array, { stream: true });
            const lines = chunks.split("\n");
            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    const data = line.slice(6);
                    try {
                        const json = JSON.parse(data);
                        if (json.answer !== undefined) {
                            answer += json.answer;
                            markdownParse(answer);
                        }
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                }
            }
        },
        () => {
            // Stream completed
        },
    );
};