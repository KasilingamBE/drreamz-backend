const cognito = require("./utils/Cognito");
const { mailer } = require("../../utils/mailer");

// const handler = async (event) => {
exports.handler = async (event) => {
  try {
    switch (event.type) {
      case "listUsersInGroup":
        return (await cognito.listUsersInGroup(event.arguments)).Users;
      case "listCognitoUsersByEmail":
        return (await cognito.listUsers(event.arguments)).Users;
      case "createGroup":
        return await cognito.createGroup(event.arguments);
      case "deleteGroup":
        return await cognito.deleteGroup(event.arguments);
      case "adminAddUserToGroup":
        return await cognito.adminAddUserToGroup(event.arguments);
      case "adminRemoveUserFromGroup":
        return await cognito.adminRemoveUserFromGroup(event.arguments);
      case "adminUpdateUserAttributes":
        return await cognito.adminUpdateUserAttributes(event.arguments);
      case "adminAddUserToGroupRole":
        await cognito.adminAddUserToGroup(event.arguments);
        await cognito.adminUpdateUserAttributes(event.arguments);
        // Send Email to driver and space owner
        const tempData = {
          emails: [event.arguments.email],
          subject: "You are added as staff member",
          message: "You are added as staff member to a parking on parkyourself",
        };
        return await mailer(tempData);
      default:
        return null;
    }
  } catch (error) {
    throw error;
  }
};

// handler.then((res) => console.log(res)).then((error) => console.log(error));

// const test = async () => {
//   const data = {
//     groupName: "VIVEK",
//     // UserPoolId: UserPoolId,
//     email: "contactvivekvt@gmail.com",
//     username: "fbac03ac-c11e-431c-8e5b-c3306f73e875",
//   };
//   // const ress = await createGroup();
//   // const ress = await deleteGroup();
//   const ress = (await cognito.listUsersInGroup(data)).Users;
//   // const ress = await adminAddUserToGroup();
//   // const ress = await adminRemoveUserFromGroup();
//   // const ress = await adminUpdateUserAttributes();
//   // const ress = await cognito.listUsers(data);
//   console.log("test function");
//   console.log("ress", ress);
// };
// test();
