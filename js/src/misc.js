class Programme
{
    constructor(code, name, faculty, programme_type) {
        this.code = code;
        this.name = name;
        this.faculty = faculty;
        this.programme_type = programme_type;
    }

    getMajorRestrictionName() {
        return `${this.code}_${this.programme_type}`;
    }
}

class Building
{
    constructor(code, name, campus_name) {
        this.code = code;
        this.name = name;
        this.campus_name = campus_name;
    }
}