import { Rating } from "../../paperpal/types/Rating.js";

export default class Review {
    id: number;
    text: string;
    paperrating : Rating;
    reviewrating : Rating;
    reviewerid : number;
    paperid : number;
}