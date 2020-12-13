const AWS = require("aws-sdk");
const UserPoolId = process.env.USER_POOL_ID;

AWS.config.region = "us-east-1";

AWS.config.apiVersions = {
  cognitoidentityserviceprovider: "2016-04-18",
};

// Disabled , Enabled
// Filter: `status = \"Disabled"`,
const adminToggleUserStatus = (data) => {
  var params = {
    UserPoolId: UserPoolId,
    Username: data.username,
  };
  if (data.status) {
    return new AWS.CognitoIdentityServiceProvider()
      .adminEnableUser(params)
      .promise();
  } else {
    return new AWS.CognitoIdentityServiceProvider()
      .adminDisableUser(params)
      .promise();
  }
};

const listAllUsers = (data) => {
  var params = {
    UserPoolId: UserPoolId,
    Limit: data.limit,
    Filter: data.filter ? data.filter : "", //`email ^= \"${data.email ? data.email : ""}"`,
  };
  if (data.paginationToken) params.PaginationToken = data.paginationToken;
  return new AWS.CognitoIdentityServiceProvider().listUsers(params).promise();
};

const createGroup = (data) => {
  var params = {
    GroupName: data.groupName,
    UserPoolId: UserPoolId,
  };
  return new AWS.CognitoIdentityServiceProvider().createGroup(params).promise();
};

const deleteGroup = (data) => {
  var params = {
    GroupName: data.groupName,
    UserPoolId: UserPoolId,
  };
  return new AWS.CognitoIdentityServiceProvider().deleteGroup(params).promise();
};

const listUsersInGroup = (data) => {
  var params = {
    GroupName: data.groupName,
    UserPoolId: UserPoolId,
  };
  return new AWS.CognitoIdentityServiceProvider()
    .listUsersInGroup(params)
    .promise();
};

const adminAddUserToGroup = (data) => {
  var params = {
    GroupName: data.groupName,
    UserPoolId: UserPoolId,
    Username: data.username,
  };
  return new AWS.CognitoIdentityServiceProvider()
    .adminAddUserToGroup(params)
    .promise();
};

const adminRemoveUserFromGroup = (data) => {
  var params = {
    GroupName: data.groupName,
    UserPoolId: UserPoolId,
    Username: data.username,
  };
  return new AWS.CognitoIdentityServiceProvider()
    .adminRemoveUserFromGroup(params)
    .promise();
};

const adminUpdateUserAttributes = (data) => {
  var params = {
    UserPoolId: UserPoolId,
    Username: data.username,
    UserAttributes: [
      {
        Name: data.name,
        Value: data.value,
      },
    ],
  };
  return new AWS.CognitoIdentityServiceProvider()
    .adminUpdateUserAttributes(params)
    .promise();
};

const listUsers = (data) => {
  var params = {
    UserPoolId: UserPoolId,
    Filter: `email = \"${data.email}"`,
  };
  return new AWS.CognitoIdentityServiceProvider().listUsers(params).promise();
};

const test = async () => {
  const data = {
    // GroupName: data.groupName,
    UserPoolId: "us-east-1_biMepTpwK",
    username: "Google_101516729143320988639",
    limit: 20,
    paginationToken: null,
    status: false,
  };
  const ress = await adminToggleUserStatus(data);
  // const ress = await listAllUsers(data);
  // const ress = await createGroup();
  // const ress = await deleteGroup();
  // const ress = await listUsersInGroup();
  // const ress = await adminAddUserToGroup();
  // const ress = await adminRemoveUserFromGroup();
  // const ress = await adminUpdateUserAttributes();
  console.log("test function");
  // console.log("ress", ress.Users[0]);
  console.log("ress", ress);
};
// test();
// node lambda-functions/common_lambda/utils/Cognito.js

module.exports = {
  adminToggleUserStatus: adminToggleUserStatus,
  listAllUsers: listAllUsers,
  createGroup: createGroup,
  deleteGroup: deleteGroup,
  listUsersInGroup: listUsersInGroup,
  adminAddUserToGroup: adminAddUserToGroup,
  adminRemoveUserFromGroup: adminRemoveUserFromGroup,
  adminUpdateUserAttributes: adminUpdateUserAttributes,
  listUsers: listUsers,
};
