const RabbitEventType = require('../../../constants');

exports.findUserInfo = (data) => {
  const { email } = data;
  let newEmail = email;

  if (typeof email !== 'string') newEmail = 'no email';
  return {
    userName: 'Newt',
    email: newEmail,
    address: 'Hoa Vang District',
  };
};

exports.subscribeEvents = async (payload) => {
  const { event, data, motelInfo } = payload;

  console.log('motelInfo from motel service', motelInfo);

  switch (event) {
    case RabbitEventType.userMessages.getInfo:
      return this.findUserInfo(data);

    default:
      throw Error('Event does not match!');
  }
};
