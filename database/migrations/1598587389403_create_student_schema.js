'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateStudentSchema extends Schema {
    up() {
        this.create('students', (table) => {
            table.increments('student_id')
            table.string("first_name", 120).notNullable()
            table.string("last_name", 120).notNullable()
            table.string("email").notNullable().unique()
            table.string("password").notNullable() //default length >255
            table.integer('group_id').unsigned() //convert group_id to unsigned interger
            table.timestamps() //auto create 2column >created_at,updated_at
            table.foreign('group_id')
                .references('groups.group_id')
                .onDelete('CASCADE') // ON DELETE CASCADE
                .onUpdate('CASCADE') // ON UPDATE CASCADE
        })
    }

    down() {
        this.drop('students')
    }
}

module.exports = CreateStudentSchema