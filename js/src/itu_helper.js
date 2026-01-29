class ITUHelper {
    LESSON_PATH = "https://raw.githubusercontent.com/itu-helper/data/refs/heads/main/lessons.psv";
    COURSE_PATH = "https://raw.githubusercontent.com/itu-helper/data/refs/heads/main/courses.psv";
    COURSE_PLAN_PATH = "https://raw.githubusercontent.com/itu-helper/data/refs/heads/main/course_plans.txt";
    PROGRAMME_CODES_PATH = "https://raw.githubusercontent.com/itu-helper/data/refs/heads/main/programme_codes.psv";
    BUILDING_CODES_PATH = "https://raw.githubusercontent.com/itu-helper/data/refs/heads/main/building_codes.psv";

    constructor() {
        this._courses = [];
        this._semesters = {};
        this._programmes = [];
        this._buildings = [];
        this.coursesDict = {};

        this.fileFetchStatus = 0;
        this.onFetchComplete = () => { };
    }

    /**
     * a list of `Course` objects.
     * 
     * ⚠️NOTE: `fetchData` must be called before accessing this property.
     */
    get courses() {
        if (this._courses.length <= 0) {
            this._createCourses();
            this._createProgrammes();
            this._createBuildings()
            this._createLessons();
            this._connectAllCourses();
        }

        return this._courses;
    }

    /**
    * a dictionary of dictionaries of dictionaries of arrays of `Course` & `CourseGroup` (Mixed).
    * Where each array represents a semester.
    * 
    * Structure:
    * 
    * `semesters["faculty name"]["programme name"]["iteration name"]` 
    * 
    * Example:
    * 
    * `semesters["Bilgisayar ve Bilişim Fakültesi"]["Yapay Zeka ve Veri Mühendisliği (% 100 İngilizce)"]["2021-2022 Güz Dönemi Sonrası"]`
    * 
    * ⚠️NOTE: `fetchData` must be called before accessing this property.
    */
    get semesters() {
        if (Object.keys(this._semesters).length <= 0) {
            this.courses;
            this._createSemesters();
        }

        return this._semesters;
    }

    get programmes() {
        if (this._programmes.length <= 0) {
            this._createProgrammes();
        }

        return this._programmes;
    }

    get buildings() {
        if (this._buildings.length <= 0) {
            this._createBuildings();
        }

        return this._buildings;
    }

    /**
     * fetches the data from itu-helper/data repo, calls `onFetchComplete`
     * when all files are fetches.
     */
    fetchData() {
        this._fetchTextFile(this.LESSON_PATH, (txt) => {
            this.lesson_lines = txt.split("\n");
            this._onTextFetchSuccess();
        });
        this._fetchTextFile(this.COURSE_PATH, (txt) => {
            this.course_lines = txt.split("\n");
            this._onTextFetchSuccess();
        });
        this._fetchTextFile(this.COURSE_PLAN_PATH, (txt) => {
            this.course_plan_lines = txt.split("\n");
            this._onTextFetchSuccess();
        });
        this._fetchTextFile(this.PROGRAMME_CODES_PATH, (txt) => {
            this.programme_codes_lines = txt.split("\n");
            this._onTextFetchSuccess();
        });
        this._fetchTextFile(this.BUILDING_CODES_PATH, (txt) => {
            this.building_codes_lines = txt.split("\n");
            this._onTextFetchSuccess();
        });
    }

    _onTextFetchSuccess() {
        this.fileFetchStatus++;
        if (this.fileFetchStatus >= 5)
            this.onFetchComplete();
    }

    /**
     * processes `course_lines` to create the `courses` array.
     */
    _createCourses() {
        let lines = this.course_lines;
        this._courses = [];
        this.coursesDict = {};

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].replace("\r", "");
            if (line.length == 0) continue;

            let data = line.split("|");
            if (data.length < 8) continue;

            let course = new Course(data[0], data[1], data[2], parseInt(data[3]), parseInt(data[4]), data[5], data[6], data[7]);
            this._courses.push(course);
        }

        this._courses.forEach(course => {
            this.coursesDict[course.courseCode] = course;
        });
    }

    /**
     * processes `lesson_lines` to create lessons and add them to
     * corresponding courses of the `courses` array.
     */
    _createLessons() {
        const available_majors = this.programmes;
        const available_buildings = this.buildings;

        let lines = this.lesson_lines;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].replace("\r", "");
            if (line.length == 0) continue;

            let data = line.split("|");
            let courseCode = data[1];
            
            let majors = [];
            if (data[10].trim() !== "-") {
                for (const m of data[10].split(",")) {
                    let major_code = m.trim().replace("_LS", "").replace("_OL", "");
                    let found_match = false;
                    for (const m_option of available_majors) {
                        if (m_option.code === major_code) {
                            majors.push(m_option);
                            found_match = true;
                        }
                    }
                    if (!found_match) {
                        majors.push(new Programme(major_code, "Auto Generated Programme", "", ""));
                    }
                }
            }

            let buildings = [];
            let buildingTexts = data[4].trim().split(" ");
            for (const b of available_buildings) {
                for (const bText of buildingTexts) {
                    if (b.code === bText.trim()) {
                        buildings.push(b);
                        buildingTexts.splice(buildingTexts.indexOf(bText), 1);
                        
                        if (buildingTexts.length === 0) break;
                    }
                }
            }

            let currentLesson = new Lesson(
                data[0], courseCode, data[2], data[3], buildings,
                data[5], data[6], data[7], data[8], data[9], majors
            );

            let course = this.findCourseByCode(courseCode);
            if (!course) continue;

            course.lessons.push(currentLesson);
        }
    }

    /**
     * processes `programme_codes_lines` to create programmes
     */
    _createProgrammes() {
        this._programmes = [];

        let lines = this.programme_codes_lines;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].replace("\r", "");
            if (line.length == 0) continue;

            let data = line.split("|");
            let currentProgramme = new Programme(data[0], data[1], data[2], data[3]);
            this._programmes.push(currentProgramme);
        }
    }

    /**
     * processes `building_codes_lines` to create buildings
     */
    _createBuildings() {
        let lines = this.building_codes_lines;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].replace("\r", "");
            if (line.length == 0) continue;

            let data = line.split("|");
            let currentBuilding = new Building(data[0], data[1], data[2]);
            this._buildings.push(currentBuilding);
        }
    }

    /**
     * calls the `course.connectCourses` method for all courses in the `courses` array.
     */
    _connectAllCourses() {
        this._courses.forEach(course => {
            course.connectCourses(this);
        });
    }

    /**
     * 
     * @param {string} courseCode the code of the course, Ex: "MAT 281E"
     * @returns the corresponding course in the `courses` array,
     * if the `courseCode` argument is empty returns null. If it is not empty
     * but a match cannot be found, creates a new course with the given title 
     * and the name `"Auto Generated Course"` and returns it.
     */
    findCourseByCode(courseCode) {
        let course = this.coursesDict[courseCode];
        if (course == undefined) {
            if (courseCode === "" || courseCode.includes("undefined")) return null;
            
            // Ders kodları 3 harfli ve büyük harf ile başlamalı.
            let coursePrefix = courseCode.split(" ")[0];
            if (coursePrefix.length != 3 || coursePrefix.toUpperCase() !== coursePrefix) {
                console.log("[Course Generation] Invalid course code: " + courseCode);
                return null;
            }

            course = Course.createAutoGeneratedCourse(courseCode);
            course.requirements = [];
            this._courses.push(course);
            this.coursesDict[courseCode] = course;

            // console.warn("[Course Generation] " + courseCode + " got auto-generated.");
        }

        return course;
    }

    /**
     * processes `course_plan_lines` to create the course plans
     * and fills it with the courses in the `courses` array.
     */
    _createSemesters() {
        let currentFaculty = "";
        let currentProgram = "";
        let currentIteration = "";
        let currentSemesters = [];
        this._semesters = [];

        let lines = this.course_plan_lines;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].replace("\r", "").trim();
            if (line.includes('# ')) {
                currentSemesters = [];
                let hashtagCount = line.split(' ')[0].length;
                let title = line.slice(hashtagCount + 1).trim();
                if (hashtagCount == 1) {
                    currentFaculty = title;
                    this._semesters[currentFaculty] = {};
                }
                if (hashtagCount == 2) {
                    // Check if the last program had any iterations
                    // If not delete it.
                    if (this._semesters[currentFaculty][currentProgram] != undefined) {
                        if (!Object.keys(this._semesters[currentFaculty][currentProgram]).length)
                            delete this._semesters[currentFaculty][currentProgram];
                    }

                    currentProgram = title;
                    this._semesters[currentFaculty][currentProgram] = {};
                }
                if (hashtagCount == 3)
                    currentIteration = title;
            }
            else {
                let semester = [];
                let courses = line.split('=');
                for (let j = 0; j < courses.length; j++) {
                    let course = courses[j];
                    // Course Group
                    if (course[0] === "[") {
                        course = course.replace("[", "").replace("]", "");
                        let courseGroupData = course.split("*");
                        courseGroupData[1] = courseGroupData[1].replace("(", "").replace(")", "");
                        let selectiveCourseNames = courseGroupData[1].split('|');
                        let selectiveCourses = [];
                        selectiveCourseNames.forEach(selectiveCourseName => {
                            selectiveCourses.push(this.findCourseByCode(selectiveCourseName));
                        });
                        semester.push(new CourseGroup(selectiveCourses, courseGroupData[0]));
                    }
                    // Course
                    else {
                        let courseObject = this.findCourseByCode(course);
                        if (courseObject == null) continue;

                        semester.push(courseObject);
                    }
                }

                currentSemesters.push(semester);

                if (currentSemesters.length == 8)
                    this._semesters[currentFaculty][currentProgram][currentIteration] = currentSemesters;
            }
        }
    }

    /**
     * @param {string} path path of the text file to fetch.
     * @param {*} onSuccess the method to call on success.
     */
    _fetchTextFile(path, onSuccess) {
        // $.ajax({
        //     url: path,
        //     type: 'get',
        //     success: onSuccess,
        // });
        fetch(path)
            .then((res) => res.text())
            .then(onSuccess)
            .catch((e) => console.error(e));
    }
}
