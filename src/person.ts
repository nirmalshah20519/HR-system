export interface Person {
  Name: string;
  Email: string;
  DOB: Date;
}

export interface Candidate extends Person {
  CandidateID: number;
}

export interface Faculty extends Person {
  FacultyID: number;
  Department:string;
}

export function getAge(dob: Date): number {
  let now = new Date();
  let age:number = now.getFullYear() - dob.getFullYear();
  if (now.getMonth() < dob.getMonth()) {
    age--;
  }
  return age;
}