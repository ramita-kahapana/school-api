'use strict'

const { group } = require("@adonisjs/framework/src/Route/Manager")

const Database = use('Database')
const Hash = use('Hash')

function numberTypeParamValidator(number) {
    if (Number.isNaN(parseInt(number)))
        return { error: `param :${number} is not supported,please use number type param instead.` }

    return {}
    //throw new Error(`param :${number} is not supported,please use number type param instead.`)
}

class StudentController {
    async index() {
        const students = await Database.table('students')

        return { status: 200, error: undefined, data: students }
    }
    async show({ request }) {
        const { id } = request.params

        //console.log(typeof id)
        //console.log(typeof parseInt(id))
        const validatedValue = numberTypeParamValidator(id)
        if (validatedValue.error)
            return { status: 500, error: validatedValue.error, data: undefined }
        const student = await Database
            .select('*')
            .from('students')
            .where("student_id", id)
            .first()

        //0,"",false,undefined,null => false จะรีเทริน obj เปล่าๆ
        //return student || {}
        return { status: 200, error: undefined, data: student || {} }
    }

    async store({ request }) {
        const { first_name, last_name, email, password, group_id } = request.body
        const missingKeys = []
        if (!first_name) missingKeys.push('first_name')
        if (!last_name) missingKeys.push('last_name')
        if (!email) missingKeys.push('email')
        if (!password) missingKeys.push('password')
        if (!group_id) missingKeys.push('group_id')


        if (missingKeys.length)
            return { status: 422, error: `${missingKeys} is missing.`, data: undefined } //ของมาไม่ครบก็คือ422

        const hashPassword = await Hash.make(password)

        const student = await Database
            .table('students')
            .insert({ first_name, last_name, email, password: hashPassword, group_id }) //add to database
        return { status: 200, error: undefined, data: { first_name, last_name, email } }
    }
}

module.exports = StudentController