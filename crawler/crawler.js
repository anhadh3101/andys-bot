

export const initializeCrawler = async (data) => {
    let blobContent = new Map();

    if (Array.isArray(data)) {
        const promises = data.map(async (element) => {
            try {
                const valid = isValid(element);
                if (element.type === "file" && valid) {
                    const elementData = await getElementData(element.git_url);
                    blobContent.set(element.name, elementData.content);
                } else if (element.type === "dir" && valid) {
                    console.log(element.name);
                    let blobPath = element.name;
                    const url = `${element.git_url}?recursive=1`;
                    const treeData = await getElementData(url);
                    const tree = treeData.tree;
    
                    if (treeData && Array.isArray(tree)) {
                        // Process the directory tree elements
                        const treePromises = tree.map(async (treeElement) => {
                            if (treeElement.type === "blob") {
                                const tempBlobPath = `${blobPath}/${treeElement.path}`;
                                const temp = await getElementData(treeElement.url);
                                blobContent.set(tempBlobPath, temp.content);
                            }
                        });
                        await Promise.all(treePromises); // Ensure all directory blobs are fetched
                    }
                }
            } catch (error) {
                console.error(`Error crawling repo for element: ${element.name}`, error);
            }
        });
    
        // Wait for all the element processing to finish
        await Promise.all(promises);
        console.log(blobContent); // Now this will have the correct content
    }
}

async function getElementData(git_url) {
    const response = await fetch(git_url, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });
    const data = await response.json();
    return data;
}

function isValid(element) {
    if (element.name.startsWith(".")) {
        return false;
    }
    else if (element.name === "README.md") {
        return false;
    }
    return true;
}