const Issue = require('../models/Issue')

const createIssue = async (req, res, next) => {
  try {
    const issue = await Issue.create(req.body)
    res.status(201).json({
      status: 'success',
      data: issue,
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({ status: 'error', message: error })
  }
}

const getAllIssues = async (req, res, next) => {
  try {
    const issues = await Issue.find()
    res.status(200).json({
      status: 'success',
      number: issues.length,
      data: issues
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({ status: 'error', message: error })
  }
}

const getOneIssue = async (req, res, next) => {
  try {
    const id = req.params.id
    const issue = await Issue.findById(id)
    res.status(200).json({
      status: 'success',
      data: issue
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({ status: 'error', message: error })
  }
}

const updateOneIssue = async (req, res, next) => {
  try {
    const id = req.params.id
    const issue = await Issue.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
    res.status(200).json({
      status: 'success',
      data: issue,
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({ status: 'error', message: error })
  }
}

const deleteOneIssue = async (req, res, next) => {
  try {
    const id = req.params.id
    await Issue.findByIdAndDelete(id)
    res.status(204).json()
  } catch (error) {
    console.log(error)
    res.status(400).json({ status: 'error', message: error })
  }
}

module.exports = {
  createIssue,
  getAllIssues,
  getOneIssue,
  deleteOneIssue,
  updateOneIssue,
}
