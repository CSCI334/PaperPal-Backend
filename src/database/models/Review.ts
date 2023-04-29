import { Rating } from "@app/paperpal/types/Rating";

interface Review {
    id: number;
    text: string;
    paperrating : Rating;
    reviewrating : Rating;
    reviewerid : number;
    paperid : number;
}
export default Review;