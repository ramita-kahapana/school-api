'use strict'

const { any } = require('@adonisjs/framework/src/Route/Manager');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Subject extends Model {
    static get primaryKey() {
        return 'subject_id'
    }
    static get createdAtColumn() {
        return null;
    }
    static get updatedAtColumn() {
        return null;
    }

    teacher() {
        return this.belongsTo('App/models/Teacher')
    }
    enrollment() {
        return this.hasMany('App/models/Enrollment')
    }
}

module.exports = Subject