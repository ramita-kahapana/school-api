'use strict'
const Database = use('Database')
const Validator = use('Validator')
const Group = use("App/Models/Group")

function numberTypeParamValidator(number) {
    if (Number.isNaN(parseInt(number)))
        return { error: `param :${number} is not supported,please use number type param instead.` }

    return {}
    //throw new Error(`param :${number} is not supported,please use number type param instead.`)
}

class GroupController {
    async index({ request }) {
        const { references = undefined } = request.qs
        const groups = Group.query()
        if (references) {
            const extractedReferences = references.split(",")
            groups.with(extractedReferences)
        }
        return { status: 200, error: undefined, data: await groups.fetch() }
    }
    async show({ request }) {
        const { id } = request.params

        //console.log(typeof id)
        //console.log(typeof parseInt(id))
        const validatedValue = numberTypeParamValidator(id)
        if (validatedValue.error)
            return { status: 500, error: validatedValue.error, data: undefined }
        const group = await Database
            .select('*')
            .from('groups')
            .where("group_id", id)
            .first()

        //0,"",false,undefined,null => false จะรีเทริน obj เปล่าๆ
        //return group || {}
        return { status: 200, error: undefined, data: group || {} }
    }

    async store({ request }) {
        const { name } = request.body
            //const missingKeys = []
        const rules = {
            name: 'required'

        }
        const validation = await Validator.validateAll(request.body, rules)

        if (validation.fails()) //true and fail
            return { status: 422, error: validation.messages(), data: undefined }
            //if (!name) missingKeys.push('name')

        const group = new Group();
        group.name = name;

        await group.save()

        return { status: 200, error: undefined, data: group }

        //if (missingKeys.length)
        //return { status: 422, error: `${missingKeys} is missing.`, data: undefined } //ของมาไม่ครบก็คือ422



        //.table('groups')
        //.insert({ name }) //add to database
        //return { status: 200, error: undefined, data: { name } }
    }
    async update({ request }) {
        //const body =request.body
        //const params =request.params
        const { body, params } = request
        const { id } = params
        const { name } = body

        const groupId = await Database
            .table('groups')
            .where({ group_id: id })
            .update({ name })

        const group = await Database
            .table('groups')
            .where({ group_id: groupId })
            .first() //rerunid

        return { status: 200, error: undefined, data: group }
    }
    async destroy({ request }) {
        const { id } = request.params

        await Database
            .table('groups')
            .where({ group_id: id })
            .delete()

        return { status: 200, error: undefined, data: { maessage: 'success' } }
    }
}

module.exports = GroupController