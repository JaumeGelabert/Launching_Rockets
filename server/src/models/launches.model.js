const launchesDatabase = require('./launches.mongo');
const planets = require('./plantes.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: 'Nombre mision',
  rocket: 'Rocket',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-1652 b',
  customers: ['Customer 1', 'Customer 2'],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

// launchId is actually the flight number
function existsLaunchWithId(launchId) {
  return launches.has(launchId);
}

async function getLatestFlightNumber() {
  // .sort() ordena de menor a mayor, por eso añadimos el '-' y cojemos el primero
  const latestLaunch = await launchesDatabase.findOne().sort('-fligthNumber');

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function getAllLaunches() {
  return await launchesDatabase.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error('No matching planet found');
  }

  await launchesDatabase.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      flightNumber: latestFlightNumber,
      customer: ['Agencia Espacial de Calvia', 'UE Space Force'],
      upcoming: true,
      success: true,
    })
  );
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
};
