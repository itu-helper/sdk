class Lesson {
    constructor(crn, teachingMethod, instructor, building, day, time, room, capacity, enrolled) {
        this.crn = crn;
        this.teachingMethod = teachingMethod?.trim();
        this.instructor = instructor?.trim();
        this.building = building?.trim();
        this.time = time?.trim();
        this.day = day?.trim();
        this.room = room?.trim();
        this.capacity = capacity;
        this.enrolled = enrolled;
    }

    /**
     * 
     * @returns An array with 2 elements, first is the start time, second is the end time.
     * Example: if `this.time` = `"0830/1129"`, then this returns `["08:30", "11:29"]`
     */
    getStartAndEndTime() {
        const times = this.time.split("/");
        return [
            times[0].slice(0, 2) + ":" + times[0].slice(2),
            times[1].slice(0, 2) + ":" + times[1].slice(2),
        ];
    }

    /**
     * Converts the string `this.day` to a number representing which day of the week it is (Week starts from mondays).
     * @returns number representing the day of the week. (-1 if cannot be parsed)
     */
    getDayAsNumber() {
        switch (this.day.toLowerCase()) {
            case "pazartesi":
                return 0;
            case "salı":
                return 1;
            case "çarşamba":
                return 2;
            case "perşember":
                return 3;
            case "cuma":
                return 4;
            case "cumartesi":
                return 5;
            case "pazar":
                return 6;
            default:
                return -1;
        }
    }
}
