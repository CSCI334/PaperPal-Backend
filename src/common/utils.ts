export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export const epochToDate = (epoch: number) => {
    return new Date(epoch);
};
export const isSortedAsc = (arr: any[]) => {
    for(let i = 1; i < arr.length; i++) {
        const firstIndex = i - 1;
        const secondIndex = i;
        
        if(arr[firstIndex] > arr[secondIndex]) return false;
    }
    return true;
};