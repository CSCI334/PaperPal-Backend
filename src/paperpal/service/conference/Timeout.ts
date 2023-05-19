export interface ConferenceTimers {
    // Triggers allocation of all bidded papers
    allocateTimer: NodeJS.Timeout

    // Triggers email notif to all author
    announcementTimer: NodeJS.Timeout
}

export interface ConferenceTimerMap {
    [key: number] : ConferenceTimers
}

export const conferenceTimerMap: ConferenceTimerMap = {}; 