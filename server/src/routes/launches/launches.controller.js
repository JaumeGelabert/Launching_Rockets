const {
  getAllLaunches,
  existsLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch,
} = require('../../models/launches.model');

async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  // Si alguno de los valores es null o undefined (Vacio), mostramos un error 400
  if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
    return res.status(400).json({ error: 'Missing required launch property' });
  }

  launch.launchDate = new Date(launch.launchDate);
  // Si no es un numero, devuelve true, por lo que mostramos el error
  if (isNaN(launch.launchDate)) {
    res.status(400).json({
      error: 'Invalid date format',
    });
  }

  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);

  const existsLaunch = await existsLaunchWithId(launchId);

  if (!existsLaunch) {
    // if launch doesnt exist
    return res.status(404).json({ error: 'Launch not found' });
  }

  // if launch exists
  const aborted = await abortLaunchById(launchId);
  if (!aborted) {
    return res.status(400).json({ error: 'Launch not aborted' });
  }
  return res.status(200).json({ ok: 'Aborted' });
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
