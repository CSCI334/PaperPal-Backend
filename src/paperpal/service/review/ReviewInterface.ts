// The way you get comments and reviews changes drastically according to accountTypes
interface ReviewInterface{
    getComments(id : number) : Promise<string>;
    getReviews(id : number) : Promise<string>;
}

export default ReviewInterface;