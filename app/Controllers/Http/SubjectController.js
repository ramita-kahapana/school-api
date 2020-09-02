'use strict'
const Database = use('Database')
const Validator = use('Validator')
const Subject = use('App/Models/Subject')

function numberTypeParamValidator(number) {
    if (Number.isNaN(parseInt(number)))
        return { error: `param :${number} is not supported,please use number type param instead.` }

    return {}
    //throw new Error(`param :${number} is not supported,please use number type param instead.`)
}
class SubjectController {
    async index({ request }) {
            //?/subjects?references=teachers
            const { references = undefined } = request.qs
                //let subjects = await Database.table('subjects') // SELECT*FROM'subjects'

            //let subjects = await Subject.all()
            //console.log(Object.keys(request))//เช็คว่าส่งค่าอะไรออกมาบ้าง
            //const queryString = request.qs
            //console.log(queryString) 
            const subjects = Subject.query()
            if (references) {
                const extractedReferences = references.split(",")
                subjects.with(extractedReferences)
            }
            return { status: 200, error: undefined, data: await subjects.fetch() }

            //const subjectsWithReferences = Database.table('subjects') //Promise<pending>
            //for (const references of extractedReferences) {
            //  subjectsWithReferences.innerJoin(references, `${references}.id`, 'subjects.id')
            //}
            //subjects = await subjectsWithReferences
        }
        // if (references) {
        //   const extractedReferences = references.split(",")
        //?references=teachers
        // subjects = await Database
        //   .table('subjects')
        // .innerJoin('teachers', 'subjects.teacher_id', 'teachers.teacher_id')
        //}


    async show({ request }) {
        const { id } = request.params
            //console.log(typeof id)
            //console.log(typeof parseInt(id))
        const validatedValue = numberTypeParamValidator(id)
        if (validatedValue.error)
            return { status: 500, error: validatedValue.error, data: undefined }
        const subject = await Subject.find(id) //=
            //const subject = await Database
            //.select('*')
            //.from('subjects')
            // .where("subject_id", id)
            //.first()

        //0,"",false,undefined,null => false จะรีเทริน obj เปล่าๆ
        //return subject || {}
        return { status: 200, error: undefined, data: subject || {} }
    }
    async showTeacher({ request }) {
        const { id } = request.params
        const subject = await Database
            .select('*')
            .from('subjects')
            .where("subject_id", id)
            .innerJoin('teachers', 'subjects.teacher_id', 'teachers.teacher_id') //query=? string=& ไว้ส่งค่าเเทนการใช้body 
            .first()

        //0,"",false,undefined,null => false จะรีเทริน obj เปล่าๆ
        //return subject || {}
        return { status: 200, error: undefined, data: subject || {} }

    }

    async store({ request }) {
        const { title, teacher_id } = request.body
            //const missingKeys = []
            //if (!title) missingKeys.push('title')
        const rules = {
            title: 'required',
            teacher_id: 'required',
        }
        const validation = await Validator.validateAll(request.body, rules)

        if (validation.fails())
            return { status: 422, error: validation.messages(), data: undefined }

        const subject = new Subject();
        subject.title = title;
        subject.teacher_id = teacher_id;
        await subject.save()
            //const subject = await Subject.create({ title, teacher_id })
        return { status: 200, error: undefined, data: subject }


        //const rules = {
        //    title: 'required',
        //    teacher_id: 'required'
        //}
        // const validation = await Validator.validateAll(request.body, rules)
        // if (validation.fails()) //true and fail
        //     return { status: 422, error: validation.messages(), data: undefined }

        //if (missingKeys.length)
        //return { status: 422, error: `${missingKeys} is missing.`, data: undefined } //ของมาไม่ครบก็คือ422

        //const subject = await Database
        //  .table('subjects')
        //  .insert({ title, teacher_id }) //add to database
        //return { status: 200, error: undefined, data: { title } }
    }
    async update({ request }) {
        const { body, params } = request
        const { id } = params
        const { title } = body

        const subjectId = await Database
            .table('subjects')
            .where({ subject_id: id })
            .update({ title })

        const subject = await Database
            .table('subjects')
            .where({ subject_id: subjectId })
            .first()

        return { status: 200, error: undefined, data: subject }
    }
    async destroy({ request }) {
        const { id } = request.params

        await Database
            .table('subjects')
            .where({ subject_id: id })
            .delete()

        return { status: 200, error: undefined, data: { message: 'success' } }
    }
}

module.exports = SubjectController