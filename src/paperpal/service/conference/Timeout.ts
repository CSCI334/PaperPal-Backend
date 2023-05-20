export interface ConferenceTimers {
    // Triggers allocation of all bidded papers
    allocateTimer: NodeJS.Timeout | null

    // Triggers email notif to all author
    announcementTimer: NodeJS.Timeout | null
}

export interface ConferenceTimerMap {
    [key: number] : ConferenceTimers
}

export const conferenceTimerMap: ConferenceTimerMap = {}; 