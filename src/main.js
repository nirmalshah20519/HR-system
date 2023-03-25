var _a, _b, _c, _d, _e;
import * as person from "./person";
import * as vacancy from "./vacancy";
import * as applicant from "./applicant";
import * as render from "./render";
let candidateLoggedin = false;
export class HRHandLer {
    constructor() {
        this.Vacancies = [];
        this.Candidates = [];
        this.Applicants = [];
        this.Faculties = [];
    }
    scheduler() { }
    result() { }
}
let hr = new HRHandLer();
let currCandidate;
let myRender = new render.Render(hr);
window.updateVacancyEdit = function (id) {
    var _a;
    let arr = hr.Vacancies.find((val) => val.VacancyID === id);
    document.getElementById("editVacDept").value =
        arr === null || arr === void 0 ? void 0 : arr.Department;
    document.getElementById("editVacRole").value =
        arr === null || arr === void 0 ? void 0 : arr.JobTitle;
    document.getElementById("editVacNo").value =
        arr === null || arr === void 0 ? void 0 : arr.NoOfVacancies;
    (_a = document.getElementById("editVacBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
        let editDept = document.getElementById("editVacDept")
            .value;
        let editRole = document.getElementById("editVacRole")
            .value;
        let editVacNo = Number(document.getElementById("editVacNo").value);
        let editVacStatus = document.querySelector("input[name=editvacStatus]:checked").value;
        let status;
        if (Number(editVacStatus)) {
            status = vacancy.vacancyStatus.open;
        }
        else {
            status = vacancy.vacancyStatus.closed;
        }
        arr.Department = editDept;
        arr.JobTitle = editRole;
        arr.NoOfVacancies = Number(editVacNo);
        arr.status = status;
        arr.updatedOn = new Date();
        myRender.renderVacancyCards();
        myRender.renderVacancyTable();
    });
};
window.deleteVacancyEdit = function (id) {
    hr.Vacancies = hr.Vacancies.filter((vacancy) => vacancy.VacancyID !== id);
    myRender.renderVacancyCards();
    myRender.renderVacancyTable();
};
window.applyJob = function (id) {
    let aid = hr.Applicants.length === 0
        ? 1
        : hr.Applicants[hr.Applicants.length - 1].InterviewID + 1;
    let cid = currCandidate.CandidateID;
    let vid = id;
    let newApplication = new applicant.AppliCant(aid, cid, vid);
    newApplication.status = applicant.InterviewStatus.pending;
    hr.Applicants.push(newApplication);
    document.getElementById(`job${id}`).value = "Applied";
    document.getElementById(`job${id}`).setAttribute("disabled", "true");
    myRender.myMethod();
    myRender.renderAppliedJobTable(currCandidate.CandidateID);
    myRender.renderAllApplicants();
    myRender.renderAllScheduledApplicants();
};
window.dispFac = function (vid, aid) {
    // console.log();
    myRender.displayFacultiesInScheduler(vid);
    document.getElementById("scheduleAid").innerHTML = aid.toString();
    document.getElementById("scheduleAid").innerHTML = aid.toString();
};
window.reRenderStatus = function (id) {
    let updatedStatus = Number(document.getElementById(`updateStatus${id}`).value);
    console.log(updatedStatus);
    let updateAppl = hr.Applicants.find(appl => appl.InterviewID === id);
    updateAppl === null || updateAppl === void 0 ? void 0 : updateAppl.setStatus(updatedStatus);
    myRender.renderAllApplicants();
    myRender.renderAllScheduledApplicants();
    myRender.renderAppliedJobTable(currCandidate.CandidateID);
    document.getElementById(`updateStatus${id}`).value = updatedStatus;
};
function validateCandidateRegistration(name, mail, dob) {
    if (name === "") {
        alert("Candidate Name is not valid");
        return false;
    }
    if (!mail.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        alert("Candidate Email is not valid");
        return false;
    }
    if (dob === "") {
        alert("Candidate DOB is not valid");
        return false;
    }
    let now = new Date().getFullYear();
    let birthyear = new Date(dob).getFullYear();
    if (now - birthyear < 18) {
        alert("Age must be greater than 18 years to register for a job");
        return false;
    }
    return true;
}
function validateCandidateLogin(cid) {
    if (isNaN(Number(cid))) {
        alert("Enter valid Candidate ID");
        return false;
    }
    return true;
}
function validateVacancyCreation(vno) {
    if (isNaN(Number(vno))) {
        alert("Enter No of Vacancies");
        return false;
    }
    return true;
}
function dashboardvisible() {
    if (!candidateLoggedin) {
        document.getElementById("candidateDB").style.display =
            "none";
        document.getElementById("notloggedin").style.display =
            "block";
        document.getElementById("login-btn").style.display =
            "block";
        document.getElementById("logout-btn").style.display =
            "none";
    }
    else {
        document.getElementById("candidateDB").style.display =
            "block";
        document.getElementById("notloggedin").style.display =
            "none";
        document.getElementById("login-btn").style.display =
            "none";
        document.getElementById("logout-btn").style.display =
            "block";
    }
}
window.onload = function () {
    dashboardvisible();
};
(_a = document.getElementById("regSubmit")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
    let cname = document.getElementById("candidateName").value;
    let cemail = document.getElementById("candidateEmail").value;
    let cdob = document.getElementById("candidateDOB").value;
    if (validateCandidateRegistration(cname, cemail, cdob)) {
        let cid = hr.Candidates.length === 0
            ? 1
            : hr.Candidates[hr.Candidates.length - 1].CandidateID + 1;
        let candidate = {
            CandidateID: cid,
            Name: cname,
            Email: cemail,
            DOB: new Date(cdob),
        };
        hr.Candidates.push(candidate);
        document.getElementById("candidateForm").reset();
        alert(`Hii ${cname} ! You are Successfully registrerd in our portal. Your candidate ID is ${cid}. You can now directly login with your candidate ID`);
    }
});
(_b = document.getElementById("candidateLogin")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () {
    let cidstr = document.getElementById("candidateID").value;
    if (validateCandidateLogin(cidstr)) {
        candidateLoggedin = true;
        let cid = Number(cidstr);
        let candidate = hr.Candidates.find((cand) => cand.CandidateID === cid);
        currCandidate = candidate;
        let dob = new Date(currCandidate === null || currCandidate === void 0 ? void 0 : currCandidate.DOB);
        let age = person.getAge(dob);
        document.getElementById("CandName").innerHTML =
            " " + (currCandidate === null || currCandidate === void 0 ? void 0 : currCandidate.Name);
        document.getElementById("CandAge").innerHTML =
            " " + age.toString();
        document.getElementById("CandEmail").innerHTML =
            " " + (currCandidate === null || currCandidate === void 0 ? void 0 : currCandidate.Email);
        dashboardvisible();
        myRender.renderAppliedJobTable(currCandidate.CandidateID);
        myRender.renderVacancyCards();
        document.getElementById("candidateLoginForm").reset();
    }
});
(_c = document.getElementById("logout-btn")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", function () {
    candidateLoggedin = false;
    dashboardvisible();
});
(_d = document.getElementById("createVac")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", function () {
    let vacDept = document.getElementById("createVacDept").value;
    let vacRole = document.getElementById("createVacRole").value;
    let vacNo = document.getElementById("createVacNo").value;
    let vacStatus = document.querySelector("input[name=vacStatus]:checked").value;
    let status;
    if (Number(vacStatus)) {
        status = vacancy.vacancyStatus.open;
    }
    else {
        status = vacancy.vacancyStatus.closed;
    }
    if (validateVacancyCreation(vacNo)) {
        let vid = hr.Vacancies.length === 0
            ? 1
            : hr.Vacancies[hr.Vacancies.length - 1].VacancyID + 1;
        let vacancy = {
            VacancyID: vid,
            Department: vacDept,
            JobTitle: vacRole,
            NoOfVacancies: Number(vacNo),
            status: status,
            updatedOn: new Date(),
        };
        hr.Vacancies.push(vacancy);
        document.getElementById("vacancyForm").reset();
        alert("Vacancy Created Successfully");
        myRender.renderVacancyCards();
        myRender.renderVacancyTable();
    }
});
(_e = document.getElementById("scheduleInterview")) === null || _e === void 0 ? void 0 : _e.addEventListener('click', function () {
    let scheduleStr = document.getElementById("interviewDateTime").value;
    let scheduleFaculty = Number(document.getElementById("selectFaculty").value);
    let AID = Number(document.getElementById("scheduleAid").innerHTML);
    console.log(AID);
    let selectApplication = hr.Applicants.find(appl => appl.InterviewID === AID);
    selectApplication === null || selectApplication === void 0 ? void 0 : selectApplication.setFaculty(scheduleFaculty);
    selectApplication === null || selectApplication === void 0 ? void 0 : selectApplication.setSchedule(new Date(scheduleStr));
    selectApplication === null || selectApplication === void 0 ? void 0 : selectApplication.setStatus(applicant.InterviewStatus.scheduled);
    myRender.renderAllApplicants();
    myRender.renderAllScheduledApplicants();
    myRender.renderAppliedJobTable(currCandidate.CandidateID);
});
hr.Vacancies = [
    {
        VacancyID: 1,
        Department: "Cloud",
        JobTitle: "Trainee",
        NoOfVacancies: 17,
        status: 1,
        updatedOn: new Date(),
    },
    {
        VacancyID: 2,
        Department: "DotNet",
        JobTitle: "Junior Developer",
        NoOfVacancies: 15,
        status: 1,
        updatedOn: new Date(),
    },
    {
        VacancyID: 3,
        Department: "Open Source",
        JobTitle: "Senior Developer",
        NoOfVacancies: 12,
        status: 0,
        updatedOn: new Date(),
    },
];
hr.Candidates = [
    {
        CandidateID: 1,
        Name: "Nirmal Shah",
        Email: "nirmal@radix.com",
        DOB: new Date(2001, 11, 13),
    },
    {
        CandidateID: 2,
        Name: "Vishal Chaudhary",
        Email: "vishal@radix.com",
        DOB: new Date(2001, 7, 16),
    },
];
hr.Faculties = [
    {
        FacultyID: 1,
        Name: "Akhilesh Nimji",
        Email: "nirmal@radix.com",
        DOB: new Date(2001, 11, 13),
        Department: "Cloud"
    },
    {
        FacultyID: 2,
        Name: "Jitali Patel",
        Email: "Jitali@radix.com",
        DOB: new Date(2001, 11, 13),
        Department: "Mobile App Development"
    },
    {
        FacultyID: 3,
        Name: "Jibran",
        Email: "jibran@radix.com",
        DOB: new Date(2001, 11, 13),
        Department: "Open Source"
    },
    {
        FacultyID: 4,
        Name: "Bhargav",
        Email: "bhargav@radix.com",
        DOB: new Date(2001, 11, 13),
        Department: "DotNet"
    },
    {
        FacultyID: 5,
        Name: "Sudip Tanver",
        Email: "sudip@radix.com",
        DOB: new Date(2001, 11, 13),
        Department: "DotNet"
    }
];
myRender.myMethod();
myRender.renderVacancyTable();
myRender.renderAllApplicants();
myRender.renderAllScheduledApplicants();
