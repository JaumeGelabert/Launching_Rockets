const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: 'Nombre mision',
  rocket: 'Rocket',
  launchDate: new Date('December 27, 2030'),
  target: 'Destination',
  customer: ['Customer 1', 'Customer 2'],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

// launchId is actually the flight number
function existsLaunchWithId(launchId) {
  return launches.has(launchId);
}

function getAllLaunches() {
  return Array.from(launches.values());
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
