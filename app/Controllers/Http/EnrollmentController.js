'use strict'
const Database = use('Database')
const Validator = use('Validator')
const Enrollment = use("App/Models/Enrollment")

function numberTypeParamValidator(number) {
    if (Number.isNaN(parseInt(number)))
        return { error: `param :${number} is not supported,please use number type param instead.` }

    return {}

}

class EnrollmentController {
    async index({ request }) {
        const { references = undefined } = request.qs
        const enrollments = Enrollment.query()
        if (references) {
            const extractedReferences = references.split(",")
            for (const value of extractedReferences) {
                enrollments.with(value)
            }
        }
        return { status: 200, error: undefined, data: await enrollments.fetch() }
    }
    async show({ request }) {
        const { id } = request.params

        const validatedValue = numberTypeParamValidator(id)
        if (validatedValue.error)
            return { status: 500, error: validatedValue.error, data: undefined }
        const enrollment = await Database
            .select('*')
            .from('enrollments')
            .where("enrollment_id", id)
            .first()

        return { status: 200, error: undefined, data: enrollment || {} }
    }

    async store({ request }) {
        const { mark, student_id, subject_id } = request.body
            //const missingKeys = []
        const rules = {
            mark: 'required',
            student_id: 'required',
            subject_id: 'required'
        }
        const validation = await Validator.validateAll(request.body, rules)

        if (validation.fails()) //true and fail
            return { status: 422, error: validation.messages(), data: undefined }
            //if (!mark) missingKeys.push('mark')
        const enrollment = new Enrollment();
        enrollment.mark = mark;
        enrollment.student_id = student_id;
        enrollment.subject_id = subject_id;

        await enrollment.save()

        return { status: 200, error: undefined, data: enrollment }


        //if (missingKeys.length)
        //return { status: 422, error: `${missingKeys} is missing.`, data: undefined }




        //.table('enrollments')
        //.insert({ mark, student_id, subject_id })
        //return { status: 200, error: undefined, data: { mark } }
    }
    async update({ request }) {
        //const body =request.body
        //const params =request.params
        const { body, params } = request
        const { id } = params
        const { mark, mark_date } = body

        const enrollmentId = await Database
            .table('enrollments')
            .where({ enrollment_id: id })
            .update({ mark, mark_date })

        const enrollment = await Database
            .table('enrollments')
            .where({ enrollment_id: enrollmentId })
            .first() //rerunid

        return { status: 200, error: undefined, data: enrollment }
    }
    async destroy({ request }) {
        const { id } = request.params

        await Database
            .table('enrollments')
            .where({ enrollment_id: id })
            .delete()

        return { status: 200, error: undefined, data: { maessage: 'success' } }
    }
}

module.exports = EnrollmentController