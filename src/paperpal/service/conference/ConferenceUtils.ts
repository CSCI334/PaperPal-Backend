import { ConferencePhase } from "@app/paperpal/types/ConferencePhase";
import Conference from "@model/Conference";



export default class ConferenceUtils {
    // TODO : Remember to make a utility function to move to next phase, the functions should simply shift around the epoch of the conference
    static getCurrentPhase(conference : Conference) : ConferencePhase {
        const currentEpoch = Date.now();

        if(currentEpoch < conference.submissiondeadline) return ConferencePhase.Submission;
        else if(currentEpoch > conference.submissiondeadline && currentEpoch < conference.biddingdeadline) return ConferencePhase.Bidding;
        else if(currentEpoch > conference.biddingdeadline && currentEpoch < conference.reviewDeadline) return ConferencePhase.Review;
        else if(currentEpoch > conference.reviewDeadline && currentEpoch < conference.announcementtime) return ConferencePhase.Judgment;
        else if(currentEpoch > conference.announcementtime) return ConferencePhase.Announcement;

        throw new Error("Invalid value");
    }
}