'use strict'

const Database = use('Database')
const Hash = use('Hash')

function numberTypeParamValidator(number) {
    if (Number.isNaN(parseInt(number)))
        return { error: `param :${number} is not supported,please use number type param instead.` }

    return {}
    //throw new Error(`param :${number} is not supported,please use number type param instead.`)
}


class TeacherController {
    //read
    async index() {
        const teachers = await Database.table('teachers')

        return { status: 200, error: undefined, data: teachers }
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
        const { first_name, last_name, email, password, student_id, subject_id } = request.body
        const missingKeys = []
        if (!first_name) missingKeys.push('first_name')
        if (!last_name) missingKeys.push('last_name')
        if (!email) missingKeys.push('email')
        if (!password) missingKeys.push('password')
        if (!student_id) missingKeys.push('student_id')
        if (!subject_id) missingKeys.push('subject_id')


        if (missingKeys.length)
            return { status: 422, error: `${missingKeys} is missing.`, data: undefined } //ของมาไม่ครบก็คือ422

        const hashPassword = await Hash.make(password)

        const teacher = await Database
            .table('teachers')
            .insert({ first_name, last_name, email, password: hashPassword, student_id, subject_id }) //add to database
        return { status: 200, error: undefined, data: { first_name, last_name, email } }
    }
}

module.exports = TeacherController