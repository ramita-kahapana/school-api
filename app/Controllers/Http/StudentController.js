'use strict'

const Student = use("App/Models/Student")

const Database = use('Database')
const Hash = use('Hash')
const Validator = use('Validator')

function numberTypeParamValidator(number) {
    if (Number.isNaN(parseInt(number)))
        return { error: `param :${number} is not supported,please use number type param instead.` }

    return {}
    //throw new Error(`param :${number} is not supported,please use number type param instead.`)
}

class StudentController {
    async index({ request }) {
        const { references = undefined } = request.qs
        const students = Student.query()
        if (references) {
            const extractedReferences = references.split(",")
            students.with(extractedReferences)
        }
        return { status: 200, error: undefined, data: await students.fetch() }
    }
    async show({ request }) {
        const { id } = request.params

        //console.log(typeof id)
        //console.log(typeof parseInt(id))
        const validatedValue = numberTypeParamValidator(id)
        if (validatedValue.error)
            return { status: 500, error: validatedValue.error, data: undefined }
        const student = await student.find(id)
    }
    async showGroup({ request }) {
        const { id } = request.params
        const student = await Database
            .select('*')
            .from('students')
            .where("student_id", id)
            .innerJoin('groups', 'students.group_id', 'groups.group_id')
            .first()

        return { status: 200, error: undefined, data: student || {} }

    }

    async store({ request }) {
        const { first_name, last_name, email, password, group_id } = request.body

        const rules = {
            first_name: 'required',
            last_name: 'required',
            email: 'required|email|unique:teachers,email',
            password: 'required|min:8',
            group_id: 'required'
        }
        const validation = await Validator.validateAll(request.body, rules)

        if (validation.fails())
            return { status: 422, error: validation.messages(), data: undefined }

        const hashPassword = await Hash.make(password)
        const student = new Student();
        student.first_name = first_name;
        student.last_name = last_name;
        student.email = email;
        student.password = password;
        await student.save()

        return { status: 200, error: undefined, data: student }



        //.table('students')
        //.insert({ first_name, last_name, email, password: hashPassword, group_id }) //add to database
        //return { status: 200, error: undefined, data: { first_name, last_name, email } }
    }

    async update({ request }) {
        const { body, params } = request
        const { id } = params
        const { first_name, last_name, email } = body

        const studentId = await Database
            .table('students')
            .where({ student_id: id })
            .update({ first_name, last_name, email })

        const student = await Database
            .table('students')
            .where({ student_id: studentId })
            .first()

        return { status: 200, error: undefined, data: student }
    }
    async destroy({ request }) {
        const { id } = request.params

        await Database
            .table('students')
            .where({ student_id: id })
            .delete()

        return { status: 200, error: undefined, data: { maessage: 'success' } }
    }
}

module.exports = StudentController