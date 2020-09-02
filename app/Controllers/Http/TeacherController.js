'use strict'

const Teacher = use("App/Models/Teacher")

const Database = use('Database')
const Hash = use('Hash')
const Validator = use('Validator')

function numberTypeParamValidator(number) {
    if (Number.isNaN(parseInt(number)))
        return { error: `param :${number} is not supported,please use number type param instead.` }

    return {}
    //throw new Error(`param :${number} is not supported,please use number type param instead.`)
}


class TeacherController {
    //read
    async index({ request }) {
        const { references = undefined } = request.qs
        const teachers = Teacher.query()
        if (references) {
            const extractedReferences = references.split(",")
            teachers.with(extractedReferences)
        }
        return { status: 200, error: undefined, data: await teachers.fetch() }
    }
    async show({ request }) {
        const { id } = request.params

        //console.log(typeof id)
        //console.log(typeof parseInt(id))
        const validatedValue = numberTypeParamValidator(id)
        if (validatedValue.error)
            return { status: 500, error: validatedValue.error, data: undefined }

        const teacher = await Database
            .select('*')
            .from('teachers')
            .where("teacher_id", id)
            .first()

        //0,"",false,undefined,null => false จะรีเทริน obj เปล่าๆ
        //return teacher || {}
        return { status: 200, error: undefined, data: teacher || {} }
    }

    //created
    async store({ request }) {
        const { first_name, last_name, email, password } = request.body

        const rules = {
            first_name: 'required',
            last_name: 'required',
            email: 'required|email|unique:teachers,email', //เหมือนเราcall fuc unique("teachers")
            password: 'required|min:8',
        }

        const validation = await Validator.validateAll(request.body, rules)

        if (validation.fails()) //true and fail
            return { status: 422, error: validation.messages(), data: undefined } //ของมาไม่ครบก็คือ422
        const hashPassword = await Hash.make(password)
        const teacher = new Teacher();
        teacher.first_name = first_name;
        teacher.last_name = last_name;
        teacher.email = email;
        teacher.password = password;
        await teacher.save()

        return { status: 200, error: undefined, data: teacher }
        //const missingKeys = []
        //if (!first_name) missingKeys.push('first_name')
        //if (!last_name) missingKeys.push('last_name')
        //if (!email) missingKeys.push('email')
        //if (!password) missingKeys.push('password')
        //if (!student_id) missingKeys.push('student_id')
        //if (!subject_id) missingKeys.push('subject_id')
        //new RegExp(/hello/gi).test("Hello World")  //regura giใส่ไว้เสมอไม่สนใจcase H เเละ hเหมือนกัน เช็คว่าในนี้มีคำว่าhello รึปล่าว
        //new RegExp("hello",gi)
        //if (missingKeys.length)
        //return { status: 422, error: `${missingKeys} is missing.`, data: undefined } //ของมาไม่ครบก็คือ422



        //.table('teachers')
        //.insert({ first_name, last_name, email, password: hashPassword }) //add to database
        //return { status: 200, error: undefined, data: { first_name, last_name, email } }
    }
    async update({ request }) {
        //const body =request.body
        //const params =request.params
        const { body, params } = request
        const { id } = params
        const { first_name, last_name, email } = body


        const teacherId = await Database
            .table('teachers')
            .where({ teacher_id: id })
            .update({ first_name, last_name, email })

        const teacher = await Database
            .table('teachers')
            .where({ teacher_id: teacherId })
            .first() //rerunid

        return { status: 200, error: undefined, data: teacher }
    }
    async destroy({ request }) {
        const { id } = request.params

        await Database
            .table('teachers')
            .where({ teacher_id: id })
            .delete()

        return { status: 200, error: undefined, data: { maessage: 'success' } }
    }

}

module.exports = TeacherController