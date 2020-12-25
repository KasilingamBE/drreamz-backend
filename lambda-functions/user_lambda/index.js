const mongoose = require('mongoose');
const DB = require('../../utils/DB');
const User = require('./utils/userModel');
const cognito = require('../common_lambda/utils/Cognito');
DB();

exports.handler = async (event) => {
  try {
    let tempUser = null;
    let tempCognitoUser = null;
    let userFlag = null;
    if (event.triggerSource) {
      console.log('Pre Sign up Event', event);
      if (event.triggerSource.includes('Facebook')) {
        event.request.userAttributes.picture =
          event.request.userAttributes.picture.data.url;
      }
      tempCognitoUser = await cognito.listUsers({
        email: event.request.userAttributes.email,
      });
      userFlag =
        tempCognitoUser &&
        tempCognitoUser.Users &&
        tempCognitoUser.Users[0] &&
        tempCognitoUser.Users[0].Username;
      // if (event.triggerSource == 'PreSignUp_AdminCreateUser') {
      //   event.response.autoVerifyEmail = true;
      //   return event;
      // } else
      if (!userFlag) {
        if (event.triggerSource == 'PreSignUp_ExternalProvider') {
          let [providerName, providerUserId] = event.userName.split('_');
          let tempUsername = await cognito.adminCreateNativeUserAndLink({
            name: event.request.userAttributes.name,
            email: event.request.userAttributes.email,
            providerName,
            providerUserId,
          });
          // tempUser = {
          //   username: tempUsername,
          //   name: event.request.userAttributes.name,
          //   email: event.request.userAttributes.email,
          //   picture: event.request.userAttributes.picture,
          //   createdBy: event.triggerSource,
          // };
          // await User.create(tempUser);
          // return event;
          return 'ACCOUNT_LINKED';
        } else {
          tempUser = {
            username: event.userName,
            name: event.request.userAttributes.name,
            email: event.request.userAttributes.email,
            picture: event.request.userAttributes.picture,
            createdBy: event.triggerSource,
          };
          await User.create(tempUser);
          return event;
        }
      } else if (
        userFlag &&
        event.triggerSource == 'PreSignUp_ExternalProvider'
      ) {
        // Link User
        let [providerName, providerUserId] = event.userName.split('_');
        await cognito.linkProviderToUser({
          username: tempCognitoUser.Users[0].Username,
          providerName,
          providerUserId,
        });
        tempUser = {
          username: event.userName,
          name: event.request.userAttributes.name,
          email: event.request.userAttributes.email,
          picture: event.request.userAttributes.picture,
          createdBy: event.triggerSource,
        };
        await User.create(tempUser);
        // throw new Error('ACCOUNT_LINKED');
        return 'ACCOUNT_LINKED';
        // return event;
      } else if (
        (userFlag && event.triggerSource == 'PreSignUp_SignUp') ||
        event.triggerSource == 'PreSignUp_AdminCreateUser'
      ) {
        return 'User already exists with this email';
      }
    }

    switch (event.type) {
      case 'getAllUsers':
        return await User.find(
          event.arguments.filter ? JSON.parse(event.arguments.filter) : {}
        );
      case 'getAllUsersSearch':
        let oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        let yearsBackFromNow = new Date();
        yearsBackFromNow.setFullYear(yearsBackFromNow.getFullYear() - 100);
        const {
          page = 1,
          limit = 10,
          status = 'open',
          search = '',
          createdAt = yearsBackFromNow,
          createdAtMax = oneYearFromNow,
          sortBy = '-createdAtDate',
        } = event.arguments;
        const users = await User.find({
          status,
          createdAtDate: {
            $gte: Date.parse(createdAt),
            $lte: Date.parse(createdAtMax),
          },
          $or: [
            {
              email: { $regex: search, $options: 'i' },
            },
            {
              name: { $regex: search, $options: 'i' },
            },
          ],
        })
          .limit(limit * 1)
          .skip((page - 1) * limit)
          .sort(sortBy)
          .exec();

        const usersCount = await User.countDocuments({
          status,
          createdAtDate: {
            $gte: Date.parse(createdAt),
            $lte: Date.parse(createdAtMax),
          },
          $or: [
            {
              email: { $regex: search, $options: 'i' },
            },
            {
              name: { $regex: search, $options: 'i' },
            },
          ],
        });

        return {
          users: users,
          count: usersCount,
        };
      case 'getOneUserId':
        return await User.findById(event.arguments.id);
      case 'getOneUserSub':
        return await User.findOne({ username: event.arguments.username });
      case 'toggleOneUserStatus':
        await cognito.adminToggleUserStatus(event.arguments);
        tempUser = await User.findOne({ username: event.arguments.username });
        tempUser._id = mongoose.Types.ObjectId();
        tempUser.ref = mongoose.Types.ObjectId(event.arguments.id);
        tempUser.status = 'close';
        tempUser.isNew = true;
        tempUser.save();
        return await User.findByIdAndUpdate(
          event.arguments.id,
          {
            active: event.arguments.status,
            updatedBy: event.arguments.updatedBy,
            updatedAt: new Date(),
          },
          {
            new: true,
            runValidators: true,
          }
        );
      case 'updateOneUser':
        tempUser = await User.findOne({ username: event.arguments.username });
        tempUser._id = mongoose.Types.ObjectId();
        tempUser.ref = mongoose.Types.ObjectId(event.arguments.id);
        tempUser.status = 'close';
        tempUser.isNew = true;
        tempUser.save();
        return await User.findByIdAndUpdate(
          event.arguments.id,
          { ...event.arguments, updatedAt: new Date() },
          {
            new: true,
            runValidators: true,
          }
        );
      default:
        return null;
    }
  } catch (error) {
    throw error;
  }
};
