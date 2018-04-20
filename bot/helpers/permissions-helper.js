const Discord = require('discord.js');
const Permissions = Discord.Permissions;

const convertPermissionOverwriteToOptions = (permissionOverwrites) => {
  let permissionOverwriteOptions = {};

  let { allowed, denied } = _createPermissionsInstances(permissionOverwrites);
  for (let flag in Permissions.FLAGS) {
    permissionOverwriteOptions[flag] =
      _convertPermissionToOption(
        allowed,
        denied,
        Permissions.FLAGS[flag]
      );
  }

  return permissionOverwriteOptions;
};

const checkPermission = (permissionOverwrites, permissionFlag) => {
  let { allowed, denied } = _createPermissionsInstances(permissionOverwrites);
  return _convertPermissionToOption(allowed, denied, permissionFlag);
};

const _convertPermissionToOption = (allowed, denied, permissionFlag) => {
  if (allowed.has(permissionFlag)) return true;
  if (denied.has(permissionFlag)) return false;
  return null;
};

const _createPermissionsInstances = (permissionOverwrites) => {
  return {
    allowed: new Permissions(permissionOverwrites.allow),
    denied: new Permissions(permissionOverwrites.deny)
  };
};

module.exports = {
  FLAGS: Permissions.FLAGS,
  convertPermissionOverwriteToOptions,
  checkPermission
};
