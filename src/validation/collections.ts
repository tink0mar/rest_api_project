export const collectionSchema = {
    type: "object",
    properties: {
        name: {type: "string"}
    },
    required: ["name"],
    additionalProperties: false
}

export const storiesSchema = {
    type: "object",
    properties: {
        ids: {
            type: "array", 
            items: {type: 'integer'},
            uniqueItems: true
        }
    },
    required: ["ids"],
    additionalProperties: false
}