const userServices = require('../services/users-services');
const ReturnResult = require('../libs/return-result');
const Constants = require('../libs/constants');
const config = require('../config');

const { createChannel, subscribeMessage } = require('../utils/broker');

const { USER_BINDING_KEY } = config.get('rabittMQ');

let channel;

(async () => {
  channel = await createChannel();
  subscribeMessage(channel, null, USER_BINDING_KEY);
})();

exports.findUserInfo = async (req, res) => {
  try {
    const result = await userServices.findUserInfo('test');

    res.send(
      new ReturnResult(
        result,
        null,
        Constants.default.userMessages.READ_USER,
        null,
        null,
      ),
    );
  } catch (error) {
    res
      .status(400)
      .send(new ReturnResult(null, null, null, error.message, null));
  }
};

// exports.subscribeEvents = async (req, res) => {
//   const payload = _get(req, 'body', {});

//   try {
//     const result = await userServices.subscribeEvents(payload);

//     res.send(
//       new ReturnResult(
//         result,
//         null,
//         Constants.default.motelMessages.CREATE_MOTEL,
//         null,
//         null,
//       ),
//     );
//   } catch (error) {
//     res
//       .status(400)
//       .send(new ReturnResult(null, null, null, error.message, null));
//   }
// };
