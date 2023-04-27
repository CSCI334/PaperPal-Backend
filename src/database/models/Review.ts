import { Rating } from "../../paperpal/types/Rating.js";

export default class Review {
    id: number;
    text: string;
    paperRating : Rating;
    reviewRating : Rating;
    reviewerid : number;
    paperid : number;
}