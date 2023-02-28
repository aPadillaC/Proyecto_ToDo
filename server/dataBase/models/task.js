const sequelize = require('../db');
const Sequelize = require('sequelize');

const Task = sequelize.define('task', { title: Sequelize.STRING, description: Sequelize.STRING, status: {type: Sequelize.BOOLEAN, defaultValue: false}});

module.exports = {Task}