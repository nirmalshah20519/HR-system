import { HRHandLer } from "./main";

export class Render {
  public constructor(public arr: HRHandLer) {}
  myMethod(): void {
    console.log(this.arr);
  }

  renderVacancyCards(): void {
    let place = document.getElementById("availableJobs") as HTMLElement;
    let vacancies = this.arr.Vacancies;
    let str = ``;
    for (const i in vacancies) {
      str += `<div class="card me-3 myBg" style="width:16rem">
            <div class="card-body pt-5">
              <span class="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-light border border-secondary py-3 text-dark w-75">${vacancies[i].JobTitle}</span>
              <h6 class="card-subtitle mb-2 text-muted bg-light p-3 rounded-2 border border-secondary">${vacancies[i].Department}</h6>
              <p class="card-text bg-light p-3 rounded-1 border border-secondary">No of Vacancies : <span class="badge bg-success">${vacancies[i].NoOfVacancies}</span></p>
              <hr>
              <input type="button" class="btn btn-outline-success btn-sm " id="job${vacancies[i].VacancyID}" onclick="applyJob(${vacancies[i].VacancyID})" role="button" value="Apply Now"/>
            </div>
          </div>`;
    }
    place.innerHTML = str;
  }

  renderVacancyTable(): void {
    let place = document.getElementById("vacTable") as HTMLElement;
    let vacancies = this.arr.Vacancies;
    let str = `<table class="table table-striped">
        <caption></caption>
          <thead>
              <tr>
                  <th>Vacancy ID</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>No of Vacancies</th>
                  <th>Status</th>
                  <th>Last Updated on</th>
                  <th>Actions</th>
              </tr>
          </thead>
          <tbody>`;
    for (const i in vacancies) {
      str += `<tr>
            <td>${vacancies[i].VacancyID}</td>
            <td>${vacancies[i].Department}</td>
            <td>${vacancies[i].JobTitle}</td>
            <td>${vacancies[i].NoOfVacancies}</td>
            <td>${vacancies[i].status ? "Open" : "Closed"}</td>
            <td>${vacancies[i].updatedOn.toLocaleDateString()}  ${vacancies[
        i
      ].updatedOn.toLocaleTimeString()}</td>
            <td>
              <div>
                <a class="btn btn-info btn-sm " href="#" data-bs-toggle="modal" data-bs-target="#vacancyModaledit" onclick="updateVacancyEdit(${
                  vacancies[i].VacancyID
                })" role="button">Edit </a>
                <a class="btn btn-danger btn-sm " href="#" onclick="deleteVacancyEdit(${
                  vacancies[i].VacancyID
                })" role="button">Delete </a>
              </div>
            </td>
          </tr>   `;
    }
    place.innerHTML = str;
    // document.querySelectorAll("")
    // document.getElementById(`vacancyTable${vacancies[i].VacancyID}`)
  }

  renderAppliedJobTable(id: number): void {
    let place = document.getElementById("appliedJobs") as HTMLElement;
    console.log(id);
    let applicants = this.arr.Applicants.filter(
      (applicant) => applicant.CandidateID === id
    );
    console.log(applicants);
    let str = `<table class="table table-striped">
        <caption></caption>
          <thead>
              <tr>
                  <th>Application ID</th>
                  <th>Department</th>
                  <th>Job Role</th>
                  <th>Schedule</th>
                  <th>Status</th>
                  <th>Message</th>
              </tr>
          </thead>
          <tbody>`;
    for (const i in applicants) {
      let candidateData = this.arr.Candidates.find(
        (cand) => cand.CandidateID === id
      );
      let vacancydata = this.arr.Vacancies.find(
        (vac) => vac.VacancyID === applicants[i].VacancyID
      );
      let statusStr = "";
      let message = ``;
      switch (applicants[i].status) {
        case 0:
          statusStr = "Pending";
          message = `Hii, <span class="text-primary fw-semibold"> ${candidateData?.Name} </span>, Thanks for applying for the <span class="text-primary fw-semibold">${vacancydata?.JobTitle}</span>  position in <span class="text-primary fw-semibold">${vacancydata?.Department}</span>  Department. Your Interview will be scheduled soon.`;
          break;
        case 1:
          statusStr = "Scheduled";
          message = `Hii, <span class="text-primary fw-semibold"> ${candidateData?.Name} </span>, We hope you are doing great. We have an update for you. Your Interview in scheduled on <span class="text-primary fw-semibold">${applicants[i].scheduleDate?.toDateString()}</span> at <span class="text-primary fw-semibold">${applicants[i].scheduleDate?.toTimeString()}</span>.`;
          break;
        case 2:
          statusStr = "On Hold";
          message = `Hii, <span class="text-primary fw-semibold"> ${candidateData?.Name} </span>, Currently we have kept your profile <span class="text-primary fw-semibold">On Hold</span>. As we complete the interviews of all remaining candidates, we will update you with the final result. Your patience is appreciated.`;
          break;
        case 3:
          statusStr = "Rejected";
          message = `Hii, <span class="text-primary fw-semibold"> ${candidateData?.Name} </span>, We have decided not to move forward with your profile for this role. You can re-apply for the same role or diffrernt roles after 3 months.`;
          break;
        case 4:
          statusStr = "Selected";
          message = `Hii, <span class="text-primary fw-semibold"> ${candidateData?.Name} </span>, We have concluded that your profile fits best for this role. We have decided to move forward with your profile. Kindly check the offer details and revert back within 48 hrs. <p> <input type="button" class="btn btn-success" onclick="candApprove(${applicants[i].InterviewID})" value="Accept">
          <input type="button" class="btn btn-danger" onclick=candDeny(${applicants[i].InterviewID}) value="Deny"></p>`;
          break;
        case 5:
          statusStr = "Hired";
          message = `Congratulations, <span class="text-primary fw-semibold"> ${candidateData?.Name} </span>, Welcome Onboard, We are glad that you accepted the offer. We will be sharing further onboarding process details soon with you.`;
            break;
        case 6:
          statusStr = "Denied";
          message = `Candidate, <span class="text-primary fw-semibold"> ${candidateData?.Name} </span>, denied the offer`;
            break;
        default:
          statusStr = "Update not Available";
          message="Update not Available";
          break;
      }
      str += `<tr>
            <td>${applicants[i].InterviewID}</td>
            <td>${vacancydata?.JobTitle}</td>
            <td>${vacancydata?.Department}</td>
            <td>${
              applicants[i].scheduleDate
                ? applicants[i].scheduleDate
                : "Not Scheduled"
            }</td>
            <td>${statusStr}</td>
            <td>${message}</td>
          </tr>   `;
    }
    place.innerHTML = str;
  }

  renderAllApplicants(): void {
    let place = document.getElementById("allApplicantsTable") as HTMLElement;
    let applicants = this.arr.Applicants.filter(
      (appl) => appl.scheduleDate === undefined
    );
    applicants.sort((a, b) => a.CandidateID - b.CandidateID);
    console.log(applicants);

    let str = `<table class="table table-info table-striped">
        <caption></caption>
          <thead>
              <tr>
                  <th>Application ID</th>
                  <th>Candidate Name</th>
                  <th>Candidate Email</th>
                  <th>Job Role & Department</th>
                  <th>Schedule</th>
                  <th>Status</th>
              </tr>
          </thead>
          <tbody>`;
    for (const i in applicants) {
      let vacancydata = this.arr.Vacancies.find(
        (vac) => vac.VacancyID === applicants[i].VacancyID
      );
      let candidatedata = this.arr.Candidates.find(
        (cand) => cand.CandidateID === applicants[i].CandidateID
      );
      let facData = this.arr.Faculties.find(
        (fac) => fac.FacultyID === applicants[i].FacultyID
      );
      let statusStr = "";

      //

      switch (applicants[i].status) {
        case 0:
          statusStr = "Pending";
          break;
        case 1:
          statusStr = "Scheduled";
          break;
        case 2:
          statusStr = "On Hold";
          break;
        case 3:
          statusStr = "Rejected";
          break;
        case 4:
          statusStr = "Selected";
          break;
        default:
          statusStr = "Update not Available";
          break;
      }
      let schedule: string = ``;
      if (applicants[i].scheduleDate) {
        schedule = `Interview scheduled on <span class="fw-semibold text-primary"> ${applicants[
          i
        ].scheduleDate?.toDateString()} </span> at <span class="fw-semibold text-primary"> ${applicants[
          i
        ].scheduleDate?.toLocaleTimeString()}</span> by Faculty <span class="fw-semibold text-primary">${
          facData?.Name
        }</span>`;
      } else {
        schedule = `<input type="button" class="btn btn-primary" value="Schedule" onclick="dispFac(${applicants[i].VacancyID},${applicants[i].InterviewID})" data-bs-toggle="modal" data-bs-target="#scheduleModal"/>`;
      }
      str += `<tr>
            <td>${applicants[i].InterviewID}</td>
            <td>${candidatedata?.Name}</td>
            <td> <a href="mailto:${candidatedata?.Email}"> ${candidatedata?.Email}</a></td>
            <td><span class="fw-semibold text-primary">${vacancydata?.JobTitle}</span> in <span class="fw-semibold text-primary">${vacancydata?.Department}</span> Department</td>
            <td>${schedule}</td>
            <td>${statusStr}</td>
          </tr>   `;
    }
    place.innerHTML = str;
    for (const i in applicants) {
      console.log(applicants[i].status);
      if (applicants[i].status < 1) {
        console.log("Enterring if");
        (
          document.getElementById(
            `updateStatus${applicants[i].InterviewID}`
          ) as HTMLFormElement
        ).setAttribute("disabled", "true");
      } else {
        console.log("Enterring else");
        (
          document.getElementById(
            `updateStatus${applicants[i].InterviewID}`
          ) as HTMLFormElement
        ).removeAttribute("disabled");
      }
    }
  }

  renderAllScheduledApplicants(): void {
    let place = document.getElementById(
      "allScheduledApplicantsTable"
    ) as HTMLElement;
    let applicants = this.arr.Applicants.filter(
      (appl) => appl.scheduleDate !== undefined
    );
    applicants.sort((a, b) => a.CandidateID - b.CandidateID);
    console.log(applicants);

    let str = `<table class="table table-info table-striped">
        <caption></caption>
          <thead>
              <tr>
                  <th>Application ID</th>
                  <th>Candidate Name</th>
                  <th>Candidate Email</th>
                  <th>Job Role & Department</th>
                  <th>Schedule</th>
                  <th>Status</th>
                  <th>Update Status</th>
              </tr>
          </thead>
          <tbody>`;
    for (const i in applicants) {
      let vacancydata = this.arr.Vacancies.find(
        (vac) => vac.VacancyID === applicants[i].VacancyID
      );
      let candidatedata = this.arr.Candidates.find(
        (cand) => cand.CandidateID === applicants[i].CandidateID
      );
      let facData = this.arr.Faculties.find(
        (fac) => fac.FacultyID === applicants[i].FacultyID
      );
      let statusStr = "";
      let updateStatusStr = `<select class="form-select" onchange="reRenderStatus(${applicants[i].InterviewID})" id="updateStatus${applicants[i].InterviewID}">
            <option value="2" >Onhold</option>
            <option value="3">Rejected</option>
            <option value="4">Selected</option>                      
          </select>`;
      //

      switch (applicants[i].status) {
        case 0:
          statusStr = "Pending";
          break;
        case 1:
          statusStr = "Scheduled";
          break;
        case 2:
          statusStr = "On Hold";
          break;
        case 3:
          statusStr = "Rejected";
          break;
        case 4:
          statusStr = "Selected";
          break;
        default:
          statusStr = "Update not Available";
          break;
      }
      let schedule: string = ``;
      if (applicants[i].scheduleDate) {
        schedule = `Interview scheduled on <span class="fw-semibold text-primary"> ${applicants[
          i
        ].scheduleDate?.toDateString()} </span> at <span class="fw-semibold text-primary"> ${applicants[
          i
        ].scheduleDate?.toLocaleTimeString()}</span> by Faculty <span class="fw-semibold text-primary">${
          facData?.Name
        }</span>`;
      } else {
        schedule = `<input type="button" class="btn btn-primary" value="Schedule" onclick="dispFac(${applicants[i].VacancyID},${applicants[i].InterviewID})" data-bs-toggle="modal" data-bs-target="#scheduleModal"/>`;
      }
      str += `<tr>
            <td>${applicants[i].InterviewID}</td>
            <td>${candidatedata?.Name}</td>
            <td> <a href="mailto:${candidatedata?.Email}"> ${candidatedata?.Email}</a></td>
            <td><span class="fw-semibold text-primary">${vacancydata?.JobTitle}</span> in <span class="fw-semibold text-primary">${vacancydata?.Department}</span> Department</td>
            <td>${schedule}</td>
            <td>${statusStr}</td>
            <td>${updateStatusStr}</td>
          </tr>   `;
    }
    place.innerHTML = str;
  }

  renderAllHiredApplicants(): void {
    let place = document.getElementById(
      "allHiredApplicantsTable"
    ) as HTMLElement;
    let applicants = this.arr.Applicants.filter(
      (appl) => appl.scheduleDate !== undefined
    );
    applicants.sort((a, b) => a.CandidateID - b.CandidateID);
    console.log(applicants);

    let str = `<table class="table table-info table-striped">
        <caption></caption>
          <thead>
              <tr>
                  <th>Application ID</th>
                  <th>Candidate Name</th>
                  <th>Candidate Email</th>
                  <th>Job Role t</th>
                  <th>Department</th>
                  <th>Hired By</th>
                  <th>Status</th>
              </tr>
          </thead>
          <tbody>`;
    for (const i in applicants) {
      let vacancydata = this.arr.Vacancies.find(
        (vac) => vac.VacancyID === applicants[i].VacancyID
      );
      let candidatedata = this.arr.Candidates.find(
        (cand) => cand.CandidateID === applicants[i].CandidateID
      );
      let facData = this.arr.Faculties.find(
        (fac) => fac.FacultyID === applicants[i].FacultyID
      );
      let statusStr = "";


      switch (applicants[i].status) {
        case 0:
          statusStr = "Pending";
          break;
        case 1:
          statusStr = "Scheduled";
          break;
        case 2:
          statusStr = "On Hold";
          break;
        case 3:
          statusStr = "Rejected";
          break;
        case 4:
          statusStr = "Selected";
          break;
      case 5:
          statusStr = "Hired";
            break;
        case 6:
          statusStr = "Denied";
            break;
        default:
          statusStr = "Update not Available";
          break;
      }
      str += `<tr>
            <td>${applicants[i].InterviewID}</td>
            <td>${candidatedata?.Name}</td>
            <td> <a href="mailto:${candidatedata?.Email}"> ${candidatedata?.Email}</a></td>
            <td><span class="fw-semibold text-primary">${vacancydata?.JobTitle}</span></td>
            <td><span class="fw-semibold text-primary">${vacancydata?.Department}</span> </td>
            <td><span class="fw-semibold text-info">${facData?.Name}</span> </td>
            <td>${statusStr}</td>
          </tr>   `;
    }
    place.innerHTML = str;
  }

  displayFacultiesInScheduler(vacid: number): void {
    let place = document.getElementById("selectFaculty") as HTMLFormElement;
    console.log(this.arr.Faculties);
    let v = this.arr.Vacancies.find((vac) => vac.VacancyID === vacid);
    let f = this.arr.Faculties.filter(
      (fac) => fac.Department === v?.Department
    );
    console.log(f);
    let str: string = ``;
    for (const i in f) {
      str += `<option value="${f[i].FacultyID}">${f[i].Name}</option>`;
    }
    place.innerHTML = str;
  }
}
