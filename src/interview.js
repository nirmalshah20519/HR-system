export var InterviewStatus;
(function (InterviewStatus) {
    InterviewStatus[InterviewStatus["pending"] = 0] = "pending";
    InterviewStatus[InterviewStatus["scheduled"] = 1] = "scheduled";
    InterviewStatus[InterviewStatus["onhold"] = 2] = "onhold";
    InterviewStatus[InterviewStatus["rejected"] = 3] = "rejected";
    InterviewStatus[InterviewStatus["selected"] = 4] = "selected";
})(InterviewStatus || (InterviewStatus = {}));
class InterView {
    constructor(InterviewID, ApplicantID, VacancyID) {
        this.InterviewID = InterviewID;
        this.ApplicantID = ApplicantID;
        this.VacancyID = VacancyID;
    }
    setFaculty(id) {
        this.FacultyID = id;
    }
    setSchedule(date) {
        this.scheduleDate = date;
    }
    setStatus(status) {
        this.status = status;
    }
    setMessage(message) {
        this.message = message;
    }
}
