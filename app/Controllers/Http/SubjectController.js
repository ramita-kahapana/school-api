'use strict'
const Database = use('Database')


function numberTypeParamValidator(number) {
    if (Number.isNaN(parseInt(number)))
        return { error: `param :${number} is not supported,please use number type param instead.` }

    return {}
    //throw new Error(`param :${number} is not supported,please use number type param instead.`)
}
class SubjectController {
    async index() {
        const subjects = await Database.table('subjects')

        return { status: 200, error: undefined, data: subjects }
    }
    async show({ request }) {
        const { id } = request.params

        //console.log(typeof id)
        //console.log(typeof parseInt(id))
        const validatedValue = numberTypeParamValidator(id)
        if (validatedValue.error)
            return { status: 500, error: validatedValue.error, data: undefined }
        const subject = await Database
            .select('*')
            .from('subjects')
            .where("subject_id", id)
            .first()

        //0,"",false,undefined,null => false จะรีเทริน obj เปล่าๆ
        //return subject || {}
        return { status: 200, error: undefined, data: subject || {} }
    }

    async store({ request }) {
        const { title, teacher_id } = request.body
        const missingKeys = []
        if (!title) missingKeys.push('title')
        if (!teacher_id) missingKeys.push('teacher_id')


        if (missingKeys.length)
            return { status: 422, error: `${missingKeys} is missing.`, data: undefined } //ของมาไม่ครบก็คือ422



        const subject = await Database
            .table('subjects')
            .insert({ title, teacher_id }) //add to database
        return { status: 200, error: undefined, data: { title } }
    }
}

module.exports = SubjectController