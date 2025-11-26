export function formatDate(value) {
    const date = new Date(value)
    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    }).format(date);
}

export function formatSalary(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0
    }).format(value) + " per year";
}

export function validateEdit (first_name, last_name, position, salary, email, department) {
    return first_name.trim() && 
    last_name.trim() && 
    position.trim() && 
    salary != 0 && 
    email.trim() && 
    department.trim()
}

export function validateCreate (first_name, last_name, salary, email, department) {
    return first_name.trim() && 
    last_name.trim() && 
    salary != 0 && 
    email.trim() && 
    department.trim()
}

