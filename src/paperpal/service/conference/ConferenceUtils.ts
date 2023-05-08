import { ConferencePhase } from "@app/paperpal/types/ConferencePhase";
import Conference from "@model/Conference";
import { isSortedAsc } from "@utils/utils";

export default class ConferenceUtils {
    static getConferencePhase(conference : Conference) : ConferencePhase {
        const currentEpoch = Date.now();
        const currentDate = new Date(currentEpoch);
        
        if(currentDate < conference.submissiondeadline) return ConferencePhase.Submission;
        else if(currentDate > conference.submissiondeadline && currentDate < conference.biddingdeadline) return ConferencePhase.Bidding;
        else if(currentDate > conference.biddingdeadline && currentDate < conference.reviewdeadline) return ConferencePhase.Review;
        else if(currentDate > conference.reviewdeadline && currentDate < conference.announcementtime) return ConferencePhase.Judgment;
        else if(currentDate > conference.announcementtime) return ConferencePhase.Announcement;
        throw new Error("Invalid value");
    }

    static deadlinesAreInOrder = (deadlines : number[]) => {
        return isSortedAsc(deadlines);
    };
}