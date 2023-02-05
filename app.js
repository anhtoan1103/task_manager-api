const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('./db/mongoose')

// Load in the mongoose models
const { List, Task } = require('./db/models')

// Load middleware
app.use(bodyParser.json())


// CORS HEADERS MIDDLEWARE
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

/* ROUTE HANDLERS */

/* LIST ROUTES */

/**
 * GET /lists
 * Purpose: Get all lists
 */
app.get('/lists', (req, res) => {
    // We want to return an array of all the list in database
    List.find({}).then((lists) => {
        res.send(lists)
    })
})

/**
 * POST /lists
 * Purpose: Post a new list
 */
app.post('/lists', (req, res) => {
    // We want to create a new list and return a new list document back to the user( which includes the id)
    // The list infomation (fields) will be passed in the JSON request body
    let title = req.body.title
    let newList = new List({
        title
    })
    newList.save().then((listDoc) => {
        // the full list document is returned (include id)
        res.send(listDoc)
    })
})

/**
 * PATCH /lists/:id
 * Purpose: Update an item of the list via id
 */
app.patch('/lists/:id', (req, res) => {
    // We want to update the specified list (list document with id in the URL) with the new value specified in the JSON body of the request
    List.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200)
    })
})


/**
 * DELETE /lists/:id
 * Purpose: Delete an item of the list via id
 * 
 */
app.delete('/lists/:id', (req, res) => {
    // We want to delete a specified list (list document with the id in the URL) with the new value specified in the JSON body of the request
    List.findOneAndRemove({ _id: req.params.id }, {}).then((removedListDoc) => {
        res.send(removedListDoc)
    })
})

/**
 * GET /lists/:listId/tasks
 * Purpose: Get all of the tasks of the specified list
 */
app.get('/lists/:listId/tasks', (req, res) => {
    // We want to return all of the tasks of the specified list (specified by listId)
    Task.find({
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks)
    })
})

/**
 * GET /lists/:listId/tasks/:taskId
 * Purpose: Get task by taskId
 */
app.get('/lists/:listId/tasks/:taskId', (req, res) => {
    // We want to get an existing task by taskId
    Task.findOne({
        _listId: req.params.listId,
        _id: req.params.taskId
    }).then((task) => {
        res.send(task)
    })
})

/**
 * POST /lists/:listId/tasks
 * Purpose: create a new task in the specified list
 */
app.post('/lists/:listId/tasks', (req, res) => {
    // We want to create a new tasks and return a new tasks to the customer
    // The task infomation will be passed in JSON request body
    let newTask = new Task({
        title: req.body.title,
        _listId: req.params.listId
    })
    newTask.save().then((newTaskDoc) => {
        res.send(newTaskDoc)
    })
})


/**
 * PATCH lists/:listId/tasks/:taskId
 * Purpose: Update an existing task 
 */
app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    // We want to update an existing task with specified taskId
    // The task infomation will be passed in the JSON request body
    Task.findOneAndUpdate({
        _id: req.params.taskId,
        _listId: req.params.listId
    }, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200)
    })
})

/**
 * DELETE /lists/:listId/tasks/:taskId
 * Purpose: Delete a task
 */
app.delete('/lists/:listId/tasks/:taskId', (req, res) => {
    // We want to delete an existing task 
    Task.findOneAndDelete({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((deletedDoc) => {
        res.send(deletedDoc)
    })
})



app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})