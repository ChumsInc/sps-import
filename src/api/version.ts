import {fetchJSON} from "chums-components";

export async function fetchVersion():Promise<string|null> {
    try {
        const {version} = await fetchJSON<{version: string}>('package.json');
        return version ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("()", err.message);
            return Promise.reject(err);
        }
        console.debug("()", err);
        return Promise.reject(new Error('Error in ()'));
    }
}
