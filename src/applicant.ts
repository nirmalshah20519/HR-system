export enum InterviewStatus {
  pending = 0,
  scheduled = 1,
  onhold = 2,
  rejected = 3,
  selected = 4,
  hired=5,
  denied=6
}
export interface Applicant {
  InterviewID: number;
  CandidateID: number;
  VacancyID: number;
  FacultyID: undefined | number;
  scheduleDate: undefined | Date;
  status: number;
  message: string;
  setFaculty(id: number): void;
  setSchedule(date: Date): void;
  setStatus(status: InterviewStatus): void;
  setMessage(message: string): void;
}

export class AppliCant implements Applicant {
  public FacultyID: undefined | number;
  public scheduleDate: undefined | Date;
  public status: InterviewStatus.pending;
  public message: string;
  public constructor(
    public InterviewID: number,
    public CandidateID: number,
    public VacancyID: number
  ) {}
  setFaculty(id: number): void {
    this.FacultyID = id;
  }
  setSchedule(date: Date): void {
    this.scheduleDate = date;
  }
  setStatus(status: number): void {
    this.status = status;
  }
  setMessage(message: string): void {
    this.message = message;
  }
}
