export enum vacancyStatus{
    closed=0,
    open=1
}

export interface Vacancy{
    VacancyID:number,
    Department:string,
    JobTitle:string,
    NoOfVacancies:number,
    status:number,
    updatedOn:Date
}