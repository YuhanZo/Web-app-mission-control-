const SubprojectModel = require('../models/subprojectModel');

async function list(req, res, next) {
  try {
    const rows = await SubprojectModel.findByProject(req.params.projectId);
    res.json(rows);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const row = await SubprojectModel.create({ project_id: req.params.projectId, ...req.body });
    res.status(201).json(row);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const row = await SubprojectModel.update(req.params.id, req.body);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await SubprojectModel.delete(req.params.id);
    res.status(204).end();
  } catch (err) { next(err); }
}

async function listAll(req, res, next) {
  try {
    const rows = await SubprojectModel.findAllWithProjects();
    res.json(rows);
  } catch (err) { next(err); }
}

module.exports = { list, create, update, remove, listAll };
