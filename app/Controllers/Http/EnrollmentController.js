'use strict'
const Database = use('Database')

function numberTypeParamValidator(number) {
    if (Number.isNaN(parseInt(number)))
        return { error: `param :${number} is not supported,please use number type param instead.` }

    return {}
    //throw new Error(`param :${number} is not supported,please use number type param instead.`)
}

class EnrollmentController {
    async index() {
        const enrollments = await Database.table('enrollments')

        return { status: 200, error: undefined, data: enrollments }
    }
    async show({ request }) {
        const { id } = request.params

        //console.log(typeof id)
        //console.log(typeof parseInt(id))
        const validatedValue = numberTypeParamValidator(id)
        if (validatedValue.error)
            return { status: 500, error: validatedValue.error, data: undefined }
        const enrollment = await Database
            .select('*')
            .from('enrollments')
            .where("enrollment_id", id)
            .first()

        //0,"",false,undefined,null => false จะรีเทริน obj เปล่าๆ
        //return enrollment || {}
        return { status: 200, error: undefined, data: enrollment || {} }
    }

    async store({ request }) {
        const { mark } = request.body
        const missingKeys = []
        if (!mark) missingKeys.push('mark')



        if (missingKeys.length)
            return { status: 422, error: `${missingKeys} is missing.`, data: undefined } //ของมาไม่ครบก็คือ422



        const enrollment = await Database
            .table('enrollments')
            .insert({ mark }) //add to database
        return { status: 200, error: undefined, data: { mark } }
    }
}

module.exports = EnrollmentController