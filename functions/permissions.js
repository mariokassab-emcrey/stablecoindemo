

const PERMISSION_WHITELIST_SEND = 1;
const PERMISSION_WHITELIST_RECEIVE = 2;
const PERMISSION_FREEZE_SEND = 4;
const PERMISSION_FREEZE_RECEIVE = 8;
const PERMISSION_BLACKLIST_SEND = 16;
const PERMISSION_BLACKLIST_RECEIVE = 32;

function isPermissioned( permissions, mask ) {
    return (permissions & mask) == mask;
}

function setPermissions( permissions, mask ) {
    return isPermissioned(permissions, mask) ? permissions : permissions + mask;
}
