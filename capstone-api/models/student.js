const db = require("../db");
const bcrypt = require("bcrypt");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");
const { validateFields } = require("../utils/validate");
const jwt = require("jsonwebtoken"); // importing the jsonwebtoken library
const crypto = require("crypto");
const secretKey = crypto.randomBytes(64).toString("hex");
const { BCRYPT_WORK_FACTOR } = require("../config");

// const jwt = require("jsonwebtoken");
// const secretKey = process.env.SECRET_KEY || "secret-dev"

class Student {
  /**
   * Convert a student from the database into a student object that can be viewed publically.
   * Don't show student's password
   *
   *
   * @param {student} student - student from database
   * @returns public student
   */
  static createPublicstudent(student) {
    return {
      id: student.id,
      email: student.email,
      firstName: student.first_name,
      lastName: student.last_name,
      parentPhone: student.parent_phone,
      zipcode: student.zipcode,
      satScore: student.sat_score,
      actScore: student.act_score,
      enrollment: student.enrollment,
      schoolType: student.school_type,
    };
  }

  /**
   * Authenticate student with email and password.
   *
   * Throws UnauthorizedError if student not found or wrong password.
   *
   * @returns student
   **/

  static async authenticate(creds) {
    // const { email, password } = creds
    const requiredCreds = ["email", "password"];

    validateFields({
      required: requiredCreds,
      obj: creds,
      location: "student authentication",
    });

    const student = await Student.fetchStudentByEmail(creds.email);

    if (student) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(creds.password, student.password);
      if (isValid === true) {
        return Student.createPublicstudent(student);
      } else {
        throw new UnauthorizedError("Invalid password.");
      }
    }
    throw new UnauthorizedError(
      "There is no student registered with this email."
    );
  }

  /**
   * Register student with data.
   *
   * Throws BadRequestError on duplicates.
   *
   * @returns student
   **/

  static async register(creds) {
    const requiredCreds = [
      "email",
      "firstName",
      "lastName",
      "parentPhone",
      "zipcode",
      "password",
    ];

    validateFields({
      required: requiredCreds,
      obj: creds,
      location: "student registration",
    });

    if (!creds.email || !creds.password) {
      throw new BadRequestError(`Fix credentials: ${creds}`);
    }
    if (await Student.fetchStudentByEmail(creds.email)) {
      throw new BadRequestError(`Duplicate email: ${creds.email}`);
    }

    const hashedPassword = await bcrypt.hash(
      creds.password,
      BCRYPT_WORK_FACTOR
    );

    const result = await db.query(
      `INSERT INTO students (
          email,
          first_name,
          last_name,
          parent_phone,
          zipcode,
          password, 
          sat_score,
          act_score,
          enrollment,
          school_type
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING 
                  id,
                  email,       
                  first_name, 
                  last_name,
                  parent_phone,
                  zipcode,
                  sat_score,
                  act_score,
                  enrollment,
                  school_type`,
      [
        creds.email.toLowerCase(),
        creds.firstName.toLowerCase(),
        creds.lastName.toLowerCase(),
        creds.parentPhone,
        creds.zipcode,
        hashedPassword,
        creds.examScores ? creds.examScores.satScore : undefined,
        creds.examScores ? creds.examScores.actScore : undefined,
        creds.enrollment ? creds.enrollment : undefined,
        creds.schoolType ? creds.schoolType : undefined,
      ]
    );

    const student = result.rows[0];
    return student;
  }

  /**
   * Fetch a student in the database by email
   *
   * @param {String} email
   * @returns student
   */
  static async fetchStudentByEmail(email) {
    const result = await db.query(
      `SELECT id,
              email, 
              first_name,
              last_name,
              parent_phone,
              zipcode,
              password,
              sat_score,
              act_score,
              enrollment,
              school_type       
           FROM students
           WHERE email = $1`,
      [email.toLowerCase()]
    );

    const student = result.rows[0];
    return student;
  }

  /**
   * Add a college to the database for a given user
   *
   * @param {Integer} studentId
   * @param {String} collegeName
   * @return college added to the database
   */
  static async likeCollege(studentId, collegeName) {
    if (await Student.userHasLiked(studentId, collegeName)){
      return
      // throw new BadRequestError("You have already liked this college!")
    }
    const result = await db.query(
      `INSERT INTO liked_colleges (
          user_id,
          college_name
        )
        VALUES ($1, $2)
        RETURNING 
                  id,
                  user_id,
                  college_name
                  `,
      [studentId, collegeName]
    );
    return result.rows[0];
  }

  /**
   * Return if an input college has been already liked by a given user
   *
   * @param {Integer} studentId
   * @param {String} collegeName
   * @return colleges in the database for a given user
   */
  static async userHasLiked(userId, collegeName) {
    const result = await db.query(
      `SELECT * FROM liked_colleges
          WHERE user_id = $1 AND college_name=$2`,
      [userId, collegeName]
    );
    return result.rowCount > 0;
  }

  /**
   * Get the names of all the colleges a given user has liked in the past
   *
   * @param {Integer} studentId
   * @return colleges in the database for a given user
   */
  static async getLikedColleges(studentId) {
    const result = await db.query(
      `SELECT * FROM liked_colleges
          WHERE user_id = $1`,
      [studentId]
    );
    return result.rows;
  }

  /**
   * Get the personalized college feed for a given user using their exam scores,
   * enrollment size, and school type
   *
   * @param {*} student_id
   * @return colleges in the database for a given user
   */
  static async getCollegeFeed(sat_score, act_score) {
    const safeSatScore =
      sat_score !== "" && Number.isFinite(Number(sat_score))
        ? Number(sat_score)
        : null;
    const safeActScore =
      act_score !== "" && Number.isFinite(Number(act_score))
        ? Number(act_score)
        : null;

    const condition =
      safeSatScore !== null
        ? `ABS((CAST(COALESCE(sat_score_critical_reading::NUMERIC, 0) AS NUMERIC) +
           CAST(COALESCE(sat_score_writing::NUMERIC, 0) AS NUMERIC) +
           CAST(COALESCE(sat_score_math::NUMERIC, 0) AS NUMERIC)) - $1::NUMERIC) <= 200`
        : "TRUE"; // Return all colleges if safeSatScore is null

    const result = await db.query(
      `SELECT * FROM colleges_from_api
       WHERE ${condition}
         AND ($2::VARCHAR IS NULL OR ABS(COALESCE(act_score::NUMERIC, 0) - $2::NUMERIC) <= 4)
      `,
      [safeSatScore, safeActScore]
    );
    // console.log("all colleges for this user: ", result.rows.length)
    // console.log("getCollegeFeed from database: ", result.rows);
    return result.rows;
  }

  /**
   * Get all the college info from the database given the name of the college
   *
   * @param {*} student_id
   * @return college information in the database for a given name
   */
  static async getCollege(collegeName) {
    const result = await db.query(
      `SELECT * FROM colleges_from_api
          WHERE name = $1`,
      [collegeName]
    );
    return result.rows[0];
  }

   /**
   * Gets the total number of current registrants for a particular
   * event from the event_attendees table in the database
   *
   * @returns events
   */
  static async getSumRegistrants(eventId) {
    const total_attendees = await db.query(
      `SELECT SUM(num_attendees)
      FROM event_attendees WHERE event_id=$1`, [eventId]
    );
    if (total_attendees.rows[0].sum){
      return parseInt(total_attendees.rows[0].sum);
    } 
    return 0
  }

  /**
   * Gets the max number of registrants for a particular
   * event from the events table in the database
   *
   * @returns max number of registrants for that event
   */
  static async getMaxNumRegistrants(eventId) {
    const maxRegistrants = await db.query(
      `SELECT max_registrants
      FROM events WHERE id=$1`
    , [parseInt(eventId)]);
    return maxRegistrants.rows[0].max_registrants;
  }


  /**
   * Add the user's event registration information into 
   * the event_attendees table in the database
   *
   * @returns user information registered
   */
  static async registerForEvent(studentId, firstName, lastName, numAttendees, eventId) {
    if (await Student.fetchEventAttendeeById(studentId, eventId)) {
      throw new BadRequestError(`You have already registered for this event.`);
    }

    const maxRegistrants = await Student.getMaxNumRegistrants(eventId)
    const totalRegistrants = await Student.getSumRegistrants(eventId)
    const spotsLeft = maxRegistrants-totalRegistrants

    if (parseInt(numAttendees) + totalRegistrants > maxRegistrants){
      throw new BadRequestError(`This event is full, sorry! Limited to ${maxRegistrants} registrants. ${spotsLeft} spots left.`)
    }

    const result = await db.query(
      `INSERT INTO event_attendees (
        student_id,
        first_name,
        last_name,
        num_attendees,
        event_id
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING 
                id,  
                student_id,    
                first_name, 
                last_name,
                num_attendees,
                event_id`,
      [
        studentId,
        firstName.toLowerCase(),
        lastName.toLowerCase(),
        numAttendees,
        eventId,
      ]
    );
    return result.rows[0];
  }

  /**
   * Get list of all events in the database
   *
   * @returns events
   */
  static async getAllEvents() {
    const result = await db.query(`SELECT * FROM events`);
    return result.rows;
  }

    /**
   * Fetch a student in event attendees table 
   * in the database by student id and particular event id
   *
   * @param {String} studentId
   * @returns student
   */
    static async fetchEventAttendeeById(studentId, eventId) {
      const result = await db.query(
        `SELECT * FROM event_attendees
             WHERE student_id = $1 AND event_id = $2`,
        [studentId, eventId]
      );
      const student = result.rows[0];
      return student;
    }


     /**
   * Delete a student in event attendees table 
   * in the database by student id and particular event id
   *
   * @param {String} studentId
   * @returns student
   */
     static async removeEventRegistration(studentId, eventId) {
      const result = await db.query(
        `DELETE FROM event_attendees
             WHERE student_id = $1 AND event_id = $2`,
        [studentId, eventId]
      );
      // returning if the student was removed
      return result.rowCount > 0;
    }
}

module.exports = Student;
