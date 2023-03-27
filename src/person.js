export function getAge(dob) {
    let now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    if (now.getMonth() < dob.getMonth()) {
        age--;
    }
    return age;
}
