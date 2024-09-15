

export const crawlRootFolder = async (data) => {
    if (Array.isArray(data)) {
        data.forEach(element => {
            console.log(element.name);
        });
    }
}