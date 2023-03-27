import * as person from "./person";
import * as vacancy from "./vacancy";
import * as applicant from "./applicant";
import * as render from "./render";

declare global {
  interface Window {
    updateVacancyEdit: Function;
    deleteVacancyEdit: Function;
    applyJob: Function;
    dispFac: Function;
    reRenderStatus: Function;
    candApprove:Function;
    candDeny:Function;
  }
}
let candidateLoggedin: boolean = false;

interface HRHandler {
  Vacancies: vacancy.Vacancy[];
  Candidates: person.Candidate[];
  Applicants: applicant.Applicant[];
  Faculties: person.Faculty[];
}

export class HRHandLer implements HRHandler {
  Vacancies: vacancy.Vacancy[] = [];
  Candidates: person.Candidate[] = [];
  Applicants: applicant.Applicant[] = [];
  Faculties: person.Faculty[] = [];
}

let hr = new HRHandLer();
let currCandidate: person.Candidate;
let myRender = new render.Render(hr);

window.updateVacancyEdit = function (id: number) {
  let arr = hr.Vacancies.find((val) => val.VacancyID === id);
  (document.getElementById("editVacDept") as HTMLFormElement).value =
    arr?.Department;
  (document.getElementById("editVacRole") as HTMLFormElement).value =
    arr?.JobTitle;
  (document.getElementById("editVacNo") as HTMLFormElement).value =
    arr?.NoOfVacancies;
  document.getElementById("editVacBtn")?.addEventListener("click", function () {
    let editDept = (document.getElementById("editVacDept") as HTMLFormElement)
      .value;
    let editRole = (document.getElementById("editVacRole") as HTMLFormElement)
      .value;
    let editVacNo = Number(
      (document.getElementById("editVacNo") as HTMLFormElement).value
    );
    let editVacStatus: string = (
      document.querySelector(
        "input[name=editvacStatus]:checked"
      ) as HTMLFormElement
    ).value!;
    let status: number;
    if (Number(editVacStatus)) {
      status = vacancy.vacancyStatus.open;
    } else {
      status = vacancy.vacancyStatus.closed;
    }
    arr!.Department = editDept;
    arr!.JobTitle = editRole;
    arr!.NoOfVacancies = Number(editVacNo);
    arr!.status = status;
    arr!.updatedOn = new Date();
    myRender.renderVacancyCards();
    myRender.renderVacancyTable();
  });
};
window.deleteVacancyEdit = function (id: number) {
  hr.Vacancies = hr.Vacancies.filter((vacancy) => vacancy.VacancyID !== id);
  myRender.renderVacancyCards();
  myRender.renderVacancyTable();
};
window.applyJob = function (id: number) {
  let aid: number =
    hr.Applicants.length === 0
      ? 1
      : hr.Applicants[hr.Applicants.length - 1].InterviewID + 1;
  let cid = currCandidate.CandidateID;
  let vid = id;
  let newApplication = new applicant.AppliCant(aid, cid, vid);
  newApplication.status = applicant.InterviewStatus.pending;
  hr.Applicants.push(newApplication);

  (document.getElementById(`job${id}`) as HTMLFormElement).value = "Applied";
  (document.getElementById(`job${id}`) as HTMLFormElement).setAttribute(
    "disabled",
    "true"
  );
  myRender.myMethod();
  myRender.renderAppliedJobTable(currCandidate.CandidateID);
  myRender.renderAllApplicants();
  myRender.renderAllScheduledApplicants();
};
window.dispFac = function (vid: number, aid: number) {
  // console.log();
  myRender.displayFacultiesInScheduler(vid);
  (document.getElementById("scheduleAid") as HTMLElement).innerHTML =
    aid.toString();
  (document.getElementById("scheduleAid") as HTMLElement).innerHTML =
    aid.toString();
};

window.reRenderStatus = function (id: number) {
  let updatedStatus = Number(
    (document.getElementById(`updateStatus${id}`) as HTMLFormElement).value
  );
  console.log(updatedStatus);
  let updateAppl = hr.Applicants.find((appl) => appl.InterviewID === id);
  updateAppl?.setStatus(updatedStatus);
  myRender.renderAllApplicants();
  myRender.renderAllScheduledApplicants();
  myRender.renderAppliedJobTable(currCandidate.CandidateID);
  (document.getElementById(`updateStatus${id}`) as HTMLFormElement).value =
    updatedStatus;
};

window.candApprove=function(aid:number){
  let hiredCand=hr.Applicants.find(appl=>appl.InterviewID===aid);
  hiredCand?.setStatus(applicant.InterviewStatus.hired)
  myRender.renderAppliedJobTable(currCandidate.CandidateID)
  myRender.renderAllHiredApplicants()
}

window.candDeny=function(aid:number){
  let hiredCand=hr.Applicants.find(appl=>appl.InterviewID===aid);
  hiredCand?.setStatus(applicant.InterviewStatus.denied)
  myRender.renderAppliedJobTable(currCandidate.CandidateID)
}

function validateCandidateRegistration(
  name: string,
  mail: string,
  dob: string
): boolean {
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
  let now: number = new Date().getFullYear();
  let birthyear: number = new Date(dob).getFullYear();
  if (now - birthyear < 18) {
    alert("Age must be greater than 18 years to register for a job");
    return false;
  }
  return true;
}
function candidateExists(cid: Number): boolean {
  let arr = hr.Candidates.find((cand) => cand.CandidateID === cid);
  if (arr) {
    return true;
  }
  return false;
}
function validateCandidateLogin(cid: string) {
  if (isNaN(Number(cid)) || cid === "") {
    alert("Enter valid Candidate ID");
    (document.getElementById("candidateLoginForm") as HTMLFormElement).reset();
    return false;
  }
  if (!candidateExists(Number(cid))) {
    alert(
      `No candidate with Candidate ID ${cid} exists. Kindly Register then Login`
    );
    (document.getElementById("candidateLoginForm") as HTMLFormElement).reset();
    return false;
  }
  (document.getElementById("candidateLoginForm") as HTMLFormElement).reset();
  return true;
}

function validateVacancyCreation(vno: string): boolean {
  if (isNaN(Number(vno))) {
    alert("Enter No of Vacancies");
    return false;
  }
  return true;
}
function dashboardvisible(): void {
  if (!candidateLoggedin) {
    (document.getElementById("candidateDB") as HTMLElement).style.display =
      "none";
    (document.getElementById("notloggedin") as HTMLElement).style.display =
      "block";
    (document.getElementById("login-btn") as HTMLElement).style.display =
      "block";
    (document.getElementById("logout-btn") as HTMLElement).style.display =
      "none";
  } else {
    (document.getElementById("candidateDB") as HTMLElement).style.display =
      "block";
    (document.getElementById("notloggedin") as HTMLElement).style.display =
      "none";
    (document.getElementById("login-btn") as HTMLElement).style.display =
      "none";
    (document.getElementById("logout-btn") as HTMLElement).style.display =
      "block";
  }
}

window.onload = function () {
  dashboardvisible();
};

document.getElementById("regSubmit")?.addEventListener("click", function () {
  let cname: string = (
    document.getElementById("candidateName") as HTMLFormElement
  ).value!;
  let cemail: string = (
    document.getElementById("candidateEmail") as HTMLFormElement
  ).value!;
  let cdob: string = (
    document.getElementById("candidateDOB") as HTMLFormElement
  ).value!;
  if (validateCandidateRegistration(cname, cemail, cdob)) {
    let cid: number =
      hr.Candidates.length === 0
        ? 1
        : hr.Candidates[hr.Candidates.length - 1].CandidateID + 1;
    let candidate: person.Candidate = {
      CandidateID: cid,
      Name: cname,
      Email: cemail,
      DOB: new Date(cdob),
    };
    hr.Candidates.push(candidate);
    (document.getElementById("candidateForm") as HTMLFormElement).reset();
    alert(
      `Hii ${cname} ! You are Successfully registrerd in our portal. Your candidate ID is ${cid}. You can now directly login with your candidate ID`
    );
  }
});

document
  .getElementById("candidateLogin")
  ?.addEventListener("click", function () {
    let cidstr: string = (
      document.getElementById("candidateID") as HTMLFormElement
    ).value;
    if (validateCandidateLogin(cidstr)) {
      candidateLoggedin = true;
      let cid: number = Number(cidstr);
      let candidate = hr.Candidates.find((cand) => cand.CandidateID === cid);
      currCandidate = candidate!;
      let dob = new Date(currCandidate?.DOB);
      let age = person.getAge(dob);
      (document.getElementById("CandName") as HTMLElement).innerHTML =
        " " + currCandidate?.Name;
      (document.getElementById("CandAge") as HTMLElement).innerHTML =
        " " + age.toString()!;
      (document.getElementById("CandEmail") as HTMLElement).innerHTML =
        " " + currCandidate?.Email;
      dashboardvisible();
      myRender.renderAppliedJobTable(currCandidate.CandidateID);
      myRender.renderVacancyCards();
      (
        document.getElementById("candidateLoginForm") as HTMLFormElement
      ).reset();
    }
  });
document.getElementById("logout-btn")?.addEventListener("click", function () {
  candidateLoggedin = false;
  dashboardvisible();
});
document.getElementById("createVac")?.addEventListener("click", function () {
  let vacDept: string = (
    document.getElementById("createVacDept") as HTMLFormElement
  ).value!;
  let vacRole: string = (
    document.getElementById("createVacRole") as HTMLFormElement
  ).value!;
  let vacNo: string = (
    document.getElementById("createVacNo") as HTMLFormElement
  ).value!;
  let vacStatus: string = (
    document.querySelector("input[name=vacStatus]:checked") as HTMLFormElement
  ).value!;
  let status: number;
  if (Number(vacStatus)) {
    status = vacancy.vacancyStatus.open;
  } else {
    status = vacancy.vacancyStatus.closed;
  }
  if (validateVacancyCreation(vacNo)) {
    let vid: number =
      hr.Vacancies.length === 0
        ? 1
        : hr.Vacancies[hr.Vacancies.length - 1].VacancyID + 1;
    let vacancy: vacancy.Vacancy = {
      VacancyID: vid,
      Department: vacDept,
      JobTitle: vacRole,
      NoOfVacancies: Number(vacNo),
      status: status,
      updatedOn: new Date(),
    };
    hr.Vacancies.push(vacancy);
    (document.getElementById("vacancyForm") as HTMLFormElement).reset();
    alert("Vacancy Created Successfully");
    myRender.renderVacancyCards();
    myRender.renderVacancyTable();
  }
});

document
  .getElementById("scheduleInterview")
  ?.addEventListener("click", function () {
    let scheduleStr = (
      document.getElementById("interviewDateTime") as HTMLFormElement
    ).value;
    let scheduleFaculty = Number(
      (document.getElementById("selectFaculty") as HTMLFormElement).value
    );
    let AID = Number(
      (document.getElementById("scheduleAid") as HTMLElement).innerHTML
    );
    console.log(AID);
    let selectApplication = hr.Applicants.find(
      (appl) => appl.InterviewID === AID
    );
    selectApplication?.setFaculty(scheduleFaculty);
    selectApplication?.setSchedule(new Date(scheduleStr));
    selectApplication?.setStatus(applicant.InterviewStatus.scheduled);
    myRender.renderAllApplicants();
    myRender.renderAllScheduledApplicants();
    myRender.renderAppliedJobTable(currCandidate.CandidateID);
  });

  document.getElementById("candApprove")?.addEventListener('click', function(){

  })

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
    Department: "Cloud",
  },
  {
    FacultyID: 2,
    Name: "Jitali Patel",
    Email: "Jitali@radix.com",
    DOB: new Date(2001, 11, 13),
    Department: "Mobile App Development",
  },
  {
    FacultyID: 3,
    Name: "Jibran",
    Email: "jibran@radix.com",
    DOB: new Date(2001, 11, 13),
    Department: "Open Source",
  },
  {
    FacultyID: 4,
    Name: "Bhargav",
    Email: "bhargav@radix.com",
    DOB: new Date(2001, 11, 13),
    Department: "DotNet",
  },
  {
    FacultyID: 5,
    Name: "Sudip Tanver",
    Email: "sudip@radix.com",
    DOB: new Date(2001, 11, 13),
    Department: "DotNet",
  },
];
myRender.myMethod();
myRender.renderVacancyTable();
myRender.renderAllApplicants();
myRender.renderAllScheduledApplicants();
